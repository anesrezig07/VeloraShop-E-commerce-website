-- =============================================================================
-- place_order(): atomic guest checkout via service-role only.
-- Recomputes prices and validates stock server-side; never trusts the client.
-- =============================================================================

create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_wilaya_id integer,
  p_commune text,
  p_shipping_address text,
  p_delivery_type text,
  p_notes text,
  p_locale text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product_id uuid;
  v_variant_id uuid;
  v_quantity integer;
  v_unit_price numeric(12,2);
  v_stock integer;
  v_active boolean;
  v_name_fr text;
  v_name_ar text;
  v_variant_name_fr text;
  v_variant_name_ar text;
begin
  if p_delivery_type not in ('home', 'stop_desk') then
    raise exception 'INVALID_DELIVERY_TYPE';
  end if;

  if p_locale not in ('fr', 'ar') then
    p_locale := 'fr';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_ITEMS';
  end if;

  select case when p_delivery_type = 'home' then dr.home_fee else dr.stop_desk_fee end
    into v_delivery_fee
  from public.delivery_rates dr
  where dr.wilaya_id = p_wilaya_id and dr.is_active = true;

  if v_delivery_fee is null then
    raise exception 'NO_DELIVERY_RATE';
  end if;

  insert into public.orders (
    customer_name, customer_phone, wilaya_id, commune, shipping_address,
    delivery_type, notes, subtotal, delivery_fee, total_amount
  ) values (
    p_customer_name, p_customer_phone, p_wilaya_id, p_commune, p_shipping_address,
    p_delivery_type, nullif(p_notes, ''), 0, v_delivery_fee, 0
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_variant_id := nullif(v_item->>'variant_id', '')::uuid;
    v_quantity := (v_item->>'quantity')::int;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'INVALID_QUANTITY';
    end if;

    v_unit_price := null;
    v_stock := null;
    v_active := null;
    v_name_fr := null;
    v_name_ar := null;
    v_variant_name_fr := null;
    v_variant_name_ar := null;

    if v_variant_id is not null then
      select
        coalesce(pv.price_override, nullif(p.sale_price, 0), p.price),
        pv.stock,
        p.is_active,
        p.name_fr,
        p.name_ar,
        pv.name_fr,
        pv.name_ar
      into v_unit_price, v_stock, v_active, v_name_fr, v_name_ar,
           v_variant_name_fr, v_variant_name_ar
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
      where pv.id = v_variant_id;
    else
      select
        coalesce(nullif(p.sale_price, 0), p.price),
        p.stock,
        p.is_active,
        p.name_fr,
        p.name_ar,
        null,
        null
      into v_unit_price, v_stock, v_active, v_name_fr, v_name_ar,
           v_variant_name_fr, v_variant_name_ar
      from public.products p
      where p.id = v_product_id;
    end if;

    if v_product_id is null or v_unit_price is null or v_active is not true then
      raise exception 'PRODUCT_UNAVAILABLE';
    end if;

    if v_stock < v_quantity then
      raise exception 'INSUFFICIENT_STOCK';
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, variant_name,
      unit_price, quantity, total_price
    ) values (
      v_order_id, v_product_id, v_variant_id,
      case when p_locale = 'ar' then v_name_ar else v_name_fr end,
      case when p_locale = 'ar' then v_variant_name_ar else v_variant_name_fr end,
      v_unit_price, v_quantity, v_unit_price * v_quantity
    );

    v_subtotal := v_subtotal + (v_unit_price * v_quantity);

    update public.products set stock = stock - v_quantity
    where id = v_product_id;

    if v_variant_id is not null then
      update public.product_variants set stock = stock - v_quantity
      where id = v_variant_id;
    end if;
  end loop;

  v_total := v_subtotal + v_delivery_fee;

  update public.orders
  set subtotal = v_subtotal, total_amount = v_total
  where id = v_order_id;

  insert into public.customers (phone, full_name, wilaya_id, total_orders, total_spent, last_order_at)
  values (p_customer_phone, p_customer_name, p_wilaya_id, 1, v_total, now())
  on conflict (phone) do update set
    full_name = excluded.full_name,
    wilaya_id = excluded.wilaya_id,
    total_orders = public.customers.total_orders + 1,
    total_spent = public.customers.total_spent + excluded.total_spent,
    last_order_at = now();

  return jsonb_build_object(
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total_amount', v_total
  );
end;
$$;

revoke all on function public.place_order(text, text, integer, text, text, text, text, text, jsonb)
  from public, anon, authenticated;

grant execute on function public.place_order(text, text, integer, text, text, text, text, text, jsonb)
  to service_role;
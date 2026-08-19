export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name_fr: string;
          name_ar: string;
          slug: string;
          description_fr: string | null;
          description_ar: string | null;
          image_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_fr: string;
          name_ar: string;
          slug: string;
          description_fr?: string | null;
          description_ar?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name_fr: string;
          name_ar: string;
          slug: string;
          description_fr: string;
          description_ar: string;
          price: number;
          sale_price: number | null;
          is_featured: boolean;
          is_best_seller: boolean;
          is_active: boolean;
          stock: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name_fr: string;
          name_ar: string;
          slug: string;
          description_fr?: string;
          description_ar?: string;
          price: number;
          sale_price?: number | null;
          is_featured?: boolean;
          is_best_seller?: boolean;
          is_active?: boolean;
          stock?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          name_fr: string;
          name_ar: string;
          options: Json;
          price_override: number | null;
          stock: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku?: string | null;
          name_fr: string;
          name_ar: string;
          options?: Json;
          price_override?: number | null;
          stock?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      wilayas: {
        Row: {
          id: number;
          code: string;
          name_fr: string;
          name_ar: string;
          is_active: boolean;
        };
        Insert: {
          id: number;
          code: string;
          name_fr: string;
          name_ar: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["wilayas"]["Insert"]>;
        Relationships: [];
      };
      delivery_rates: {
        Row: {
          id: string;
          wilaya_id: number;
          home_fee: number;
          stop_desk_fee: number;
          estimated_days_min: number;
          estimated_days_max: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          wilaya_id: number;
          home_fee?: number;
          stop_desk_fee?: number;
          estimated_days_min?: number;
          estimated_days_max?: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["delivery_rates"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "delivery_rates_wilaya_id_fkey";
            columns: ["wilaya_id"];
            isOneToOne: true;
            referencedRelation: "wilayas";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          wilaya_id: number;
          commune: string;
          shipping_address: string;
          delivery_type: string;
          notes: string | null;
          subtotal: number;
          delivery_fee: number;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_name: string;
          customer_phone: string;
          wilaya_id: number;
          commune: string;
          shipping_address: string;
          delivery_type?: string;
          notes?: string | null;
          subtotal: number;
          delivery_fee: number;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_wilaya_id_fkey";
            columns: ["wilaya_id"];
            isOneToOne: false;
            referencedRelation: "wilayas";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          unit_price: number;
          quantity: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          unit_price: number;
          quantity: number;
          total_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          full_name: string;
          wilaya_id: number | null;
          total_orders: number;
          total_spent: number;
          last_order_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          full_name: string;
          wilaya_id?: number | null;
          total_orders?: number;
          total_spent?: number;
          last_order_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "customers_wilaya_id_fkey";
            columns: ["wilaya_id"];
            isOneToOne: false;
            referencedRelation: "wilayas";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "admin_users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      place_order: {
        Args: {
          p_customer_name: string;
          p_customer_phone: string;
          p_wilaya_id: number;
          p_commune: string;
          p_shipping_address: string;
          p_delivery_type: string;
          p_notes: string;
          p_locale: string;
          p_items: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

-- =============================================================================
-- Velora Shop — Development seed data
-- Populates: wilayas (58), delivery rates, categories, products, images,
-- variants, and a handful of example orders across every status.
-- Safe to re-run: destructive tables are cleared first.
-- =============================================================================

truncate table public.order_items cascade;
truncate table public.orders cascade;
truncate table public.customers cascade;
truncate table public.product_variants cascade;
truncate table public.product_images cascade;
truncate table public.products cascade;
truncate table public.categories cascade;
truncate table public.delivery_rates cascade;
truncate table public.wilayas cascade;

alter sequence public.order_number_seq restart with 1000;

-- -----------------------------------------------------------------------------
-- Wilayas (58)
-- -----------------------------------------------------------------------------
insert into public.wilayas (id, code, name_fr, name_ar) values
  (1,  '01', 'Adrar',                    'أدرار'),
  (2,  '02', 'Chlef',                    'الشلف'),
  (3,  '03', 'Laghouat',                 'الأغواط'),
  (4,  '04', 'Oum El Bouaghi',           'أم البواقي'),
  (5,  '05', 'Batna',                    'باتنة'),
  (6,  '06', 'Béjaïa',                   'بجاية'),
  (7,  '07', 'Biskra',                   'بسكرة'),
  (8,  '08', 'Béchar',                   'بشار'),
  (9,  '09', 'Blida',                    'البليدة'),
  (10, '10', 'Bouira',                   'البويرة'),
  (11, '11', 'Tamanrasset',              'تمنراست'),
  (12, '12', 'Tébessa',                  'تبسة'),
  (13, '13', 'Tlemcen',                  'تلمسان'),
  (14, '14', 'Tiaret',                   'تيارت'),
  (15, '15', 'Tizi Ouzou',               'تيزي وزو'),
  (16, '16', 'Alger',                    'الجزائر'),
  (17, '17', 'Djelfa',                   'الجلفة'),
  (18, '18', 'Jijel',                    'جيجل'),
  (19, '19', 'Sétif',                    'سطيف'),
  (20, '20', 'Saïda',                    'سعيدة'),
  (21, '21', 'Skikda',                   'سكيكدة'),
  (22, '22', 'Sidi Bel Abbès',           'سيدي بلعباس'),
  (23, '23', 'Annaba',                   'عنابة'),
  (24, '24', 'Guelma',                   'قالمة'),
  (25, '25', 'Constantine',              'قسنطينة'),
  (26, '26', 'Médéa',                    'المدية'),
  (27, '27', 'Mostaganem',               'مستغانم'),
  (28, '28', 'M''Sila',                  'المسيلة'),
  (29, '29', 'Mascara',                  'معسكر'),
  (30, '30', 'Ouargla',                  'ورقلة'),
  (31, '31', 'Oran',                     'وهران'),
  (32, '32', 'El Bayadh',                'البيض'),
  (33, '33', 'Illizi',                   'إيليزي'),
  (34, '34', 'Bordj Bou Arréridj',       'برج بوعريريج'),
  (35, '35', 'Boumerdès',                'بومرداس'),
  (36, '36', 'El Tarf',                  'الطارف'),
  (37, '37', 'Tindouf',                  'تندوف'),
  (38, '38', 'Tissemsilt',               'تيسمسيلت'),
  (39, '39', 'El Oued',                  'الوادي'),
  (40, '40', 'Khenchela',                'خنشلة'),
  (41, '41', 'Souk Ahras',               'سوق أهراس'),
  (42, '42', 'Tipaza',                   'تيبازة'),
  (43, '43', 'Mila',                     'ميلة'),
  (44, '44', 'Aïn Defla',                'عين الدفلى'),
  (45, '45', 'Naâma',                    'النعامة'),
  (46, '46', 'Aïn Témouchent',           'عين تموشنت'),
  (47, '47', 'Ghardaïa',                 'غرداية'),
  (48, '48', 'Relizane',                 'غليزان'),
  (49, '49', 'Timimoun',                 'تيميمون'),
  (50, '50', 'Bordj Badji Mokhtar',      'برج باجي مختار'),
  (51, '51', 'Ouled Djellal',            'أولاد جلال'),
  (52, '52', 'Béni Abbès',               'بني عباس'),
  (53, '53', 'In Salah',                 'عين صالح'),
  (54, '54', 'In Guezzam',               'عين قزام'),
  (55, '55', 'Touggourt',                'تقرت'),
  (56, '56', 'Djanet',                   'جانت'),
  (57, '57', 'El M''Ghair',              'المغير'),
  (58, '58', 'El Meniaa',                'المنيعة');

-- -----------------------------------------------------------------------------
-- Delivery rates (sensible defaults, editable from the admin dashboard)
-- -----------------------------------------------------------------------------
insert into public.delivery_rates
  (wilaya_id, home_fee, stop_desk_fee, estimated_days_min, estimated_days_max)
select
  w.id,
  case
    when w.id = 16 then 400
    when w.id in (47, 55, 57) then 700
    when w.id in (1, 11, 30, 32, 33, 37, 45, 49, 50, 51, 52, 53, 54, 56, 58) then 900
    else 500
  end as home_fee,
  case
    when w.id = 16 then 250
    when w.id in (47, 55, 57) then 500
    when w.id in (1, 11, 30, 32, 33, 37, 45, 49, 50, 51, 52, 53, 54, 56, 58) then 700
    else 350
  end as stop_desk_fee,
  case
    when w.id = 16 then 1
    when w.id in (1, 11, 30, 32, 33, 37, 45, 49, 50, 51, 52, 53, 54, 56, 58) then 4
    when w.id in (47, 55, 57) then 3
    else 2
  end as estimated_days_min,
  case
    when w.id = 16 then 2
    when w.id in (1, 11, 30, 32, 33, 37, 45, 49, 50, 51, 52, 53, 54, 56, 58) then 5
    when w.id in (47, 55, 57) then 4
    else 3
  end as estimated_days_max
from public.wilayas w;

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
insert into public.categories (slug, name_fr, name_ar, description_fr, description_ar, display_order, image_url) values
  ('smartphones',        'Téléphones & Accessoires', 'الهواتف وملحقاتها', 'Smartphones, accessoires et appareils connectés.', 'هواتف ذكية وملحقات وأجهزة متصلة.', 1, 'https://picsum.photos/seed/velora-cat-smartphones/600/600'),
  ('electronique',       'Électronique',             'إلكترونيات',        'TV, audio et produits high-tech.', 'تلفزيونات وصوت ومنتجات تقنية.', 2, 'https://picsum.photos/seed/velora-cat-electronique/600/600'),
  ('electromenager',     'Électroménager',           'الأجهزة المنزلية',  'Petit et gros électroménager.', 'أجهزة منزلية صغيرة وكبيرة.', 3, 'https://picsum.photos/seed/velora-cat-electromenager/600/600'),
  ('beaute-parfums',     'Beauté & Parfums',         'الجمال والعطور',    'Parfums, soins et cosmétiques.', 'عطور وعناية وتجميل.', 4, 'https://picsum.photos/seed/velora-cat-beaute/600/600'),
  ('maison-cuisine',     'Maison & Cuisine',         'المنزل والمطبخ',    'Ustensiles, décoration et équipement de cuisine.', 'أواني وديكور ومعدات مطبخ.', 5, 'https://picsum.photos/seed/velora-cat-maison/600/600'),
  ('vetements',          'Vêtements',                'ملابس',             'Mode homme et femme.', 'أزياء رجالية ونسائية.', 6, 'https://picsum.photos/seed/velora-cat-vetements/600/600'),
  ('chaussures',         'Chaussures',               'أحذية',             'Chaussures pour homme, femme et enfant.', 'أحذية رجالية ونسائية ولأطفال.', 7, 'https://picsum.photos/seed/velora-cat-chaussures/600/600'),
  ('sports-loisirs',     'Sports & Loisirs',         'الرياضة والترفيه',  'Matériel de sport et loisirs.', 'معدات رياضية وترفيهية.', 8, 'https://picsum.photos/seed/velora-cat-sports/600/600'),
  ('jouets',             'Jouets',                   'ألعاب الأطفال',     'Jouets pour tous les âges.', 'ألعاب لكل الأعمار.', 9, 'https://picsum.photos/seed/velora-cat-jouets/600/600');

-- -----------------------------------------------------------------------------
-- Products
-- -----------------------------------------------------------------------------
insert into public.products
  (slug, category_id, name_fr, name_ar, price, sale_price, stock, is_featured, is_best_seller, description_fr, description_ar)
values
  ('samsung-galaxy-a55',        (select id from public.categories where slug = 'smartphones'),
   'Téléphone Samsung Galaxy A55 5G 256 Go', 'هاتف سامسونج جالاكسي A55 5G 256 جيجا',
   87900, 82900, 12, true, true,
   'Smartphone Samsung Galaxy A55 5G, 256 Go de stockage, double SIM, appareil photo 50 MP, batterie 5000 mAh. Garantie 12 mois.',
   'هاتف سامسونج جالاكسي A55 5G، ذاكرة 256 جيجا، شريحتين، كاميرا 50 ميجابكسل، بطارية 5000 مللي أمبير. ضمان 12 شهراً.'),

  ('ecouteurs-jbl-tune',       (select id from public.categories where slug = 'smartphones'),
   'Écouteurs sans fil JBL Tune 720BT', 'سماعات أذن لاسلكية JBL Tune 720BT',
   8500, null, 35, true, false,
   'Casque sans fil JBL avec Bluetooth, réduction de bruit, autonomie de 60 heures et pliage compact.',
   'سماعة JBL لاسلكية بتقنية البلوتوث، عزل الضوضاء، بطارية تدوم 60 ساعة وقابلة للطي.'),

  ('montre-connectee-s9',      (select id from public.categories where slug = 'smartphones'),
   'Montre connectée Smart Watch S9', 'ساعة ذكية S9',
   12900, 10900, 25, true, false,
   'Montre connectée avec écran AMOLED, suivi sportif, rythme cardiaque, oxymètre et étanchéité IP68.',
   'ساعة ذكية بشاشة AMOLED، تتبع رياضي، قياس نبضات القلب والأكسجين، مقاومة للماء IP68.'),

  ('chargeur-samsung-25w',     (select id from public.categories where slug = 'smartphones'),
   'Chargeur Samsung 25W Type-C', 'شاحن سامسونج 25 واط Type-C',
   2500, null, 80, false, false,
   'Chargeur rapide Samsung 25W avec câble USB-C, compatible tous smartphones.',
   'شاحن سامسونج سريع 25 واط مع كابل USB-C، متوافق مع جميع الهواتف.'),

  ('enceinte-bluetooth',       (select id from public.categories where slug = 'electronique'),
   'Enceinte Bluetooth portable 20W', 'مكبر صوت بلوتوث محمول 20 واط',
   5900, null, 30, false, false,
   'Enceinte Bluetooth 20W, étanche IPX7, autonomie 12 heures et son puissant.',
   'مكبر صوت بلوتوث 20 واط، مقاوم للماء IPX7، بطارية 12 ساعة وصوت قوي.'),

  ('casque-gaming-71',         (select id from public.categories where slug = 'electronique'),
   'Casque gaming 7.1 RGB', 'سماعة ألعاب 7.1 RGB',
   7900, 6900, 18, false, false,
   'Casque gaming avec son surround 7.1, micro antibruit et éclairage RGB.',
   'سماعة ألعاب بصوت محيطي 7.1، ميكروفون عازل للضوضاء وإضاءة RGB.'),

  ('smart-tv-55-4k',           (select id from public.categories where slug = 'electronique'),
   'Smart TV 55 pouces 4K UHD', 'تلفزيون ذكي 55 بوصة 4K',
   165000, null, 5, true, false,
   'Smart TV 55 pouces 4K UHD avec Wi-Fi, Bluetooth et plateformes de streaming intégrées.',
   'تلفزيون ذكي 55 بوصة بدقة 4K مع واي فاي وبلوتوث ومنصات البث المدمجة.'),

  ('aspirateur-robot',         (select id from public.categories where slug = 'electromenager'),
   'Aspirateur robot intelligent', 'مكنسة كهربائية روبوت ذكية',
   45900, 39900, 7, true, false,
   'Aspirateur robot avec navigation intelligente, capteurs anti-chute et fonction lavage.',
   'مكنسة روبوت ذكية مع ملاحة ذكية وحساسات مانعة للسقوط ووظيفة الغسيل.'),

  ('mixeur-plongeant',         (select id from public.categories where slug = 'electromenager'),
   'Mixeur plongeant 800W', 'خلاط يدوي 800 واط',
   6400, null, 40, false, false,
   'Mixeur plongeant 800W avec bol et accessoires, parfait pour soupes et smoothies.',
   'خلاط يدوي 800 واط مع وعاء وملحقات، مثالي للحساء والعصائر.'),

  ('robot-multifonction',      (select id from public.categories where slug = 'electromenager'),
   'Robot multifonction 5-en-1', 'روبوت متعدد الوظائف 5 في 1',
   15900, null, 15, false, false,
   'Robot de cuisine 5-en-1 : hache, mélange, pétrit, bat et presse-agrumes.',
   'روبوت مطبخ 5 في 1: يفرم، يخلط، يعجن، يخفق ويعصر.'),

  ('machine-cafe-expresso',    (select id from public.categories where slug = 'electromenager'),
   'Machine à café expresso', 'آلة قهوة إسبريسو',
   34500, 29900, 9, false, true,
   'Machine à café expresso avec mousseur à lait, réservoir 1,5 L et pression 15 bars.',
   'آلة إسبريسو مع مبخرة حليب، خزان 1.5 لتر وضغط 15 بار.'),

  ('fer-repasser-vapeur',      (select id from public.categories where slug = 'electromenager'),
   'Fer à repasser vapeur 2400W', 'مكواة بخار 2400 واط',
   7200, null, 28, false, false,
   'Fer à repasser vapeur 2400W avec semelle anti-adhésive et fonction anti-calcaire.',
   'مكواة بخار 2400 واط بقاعدة مانعة للالتصاق ووظيفة مضادة للترسبات.'),

  ('parfum-homme-100',         (select id from public.categories where slug = 'beaute-parfums'),
   'Parfum homme 100 ml', 'عطر رجالي 100 مل',
   4900, null, 50, false, true,
   'Parfum homme intense et élégant, notes boisées et épicées, tenue longue durée.',
   'عطر رجالي قوي وأنيق، بروائح خشبية وحارة، ثبات طويل.'),

  ('parfum-femme-80',          (select id from public.categories where slug = 'beaute-parfums'),
   'Parfum femme 80 ml', 'عطر نسائي 80 مل',
   5400, null, 45, false, false,
   'Parfum femme floral et raffiné, sillage élégant pour toutes les occasions.',
   'عطر نسائي زهري راقٍ، فوحان أنيق لجميع المناسبات.'),

  ('coffret-soins-visage',     (select id from public.categories where slug = 'beaute-parfums'),
   'Coffret soins visage complet', 'طقم العناية بالوجه كامل',
   3800, 2900, 22, false, false,
   'Coffret de soins visage : nettoyant, sérum, crème hydratante et masque.',
   'طقم عناية بالوجه: غسول، سيروم، كريم مرطب وقناع.'),

  ('shampoing-huile-coco',     (select id from public.categories where slug = 'beaute-parfums'),
   'Shampoing naturel huile de coco', 'شامبو طبيعي بزيت جوز الهند',
   1100, null, 120, false, false,
   'Shampoing naturel à l''huile de coco, nourrit et répare les cheveux secs.',
   'شامبو طبيعي بزيت جوز الهند، يغذي ويصلح الشعر الجاف.'),

  ('set-casseroles-6',         (select id from public.categories where slug = 'maison-cuisine'),
   'Set de casseroles 6 pièces', 'طقم أواني طهي 6 قطع',
   18900, null, 14, false, false,
   'Set de 6 casseroles anti-adhésives avec couvercles en verre, compatibles tous feux.',
   'طقم 6 أواني طهي مانعة للالتصاق مع أغطية زجاجية، متوافقة مع جميع المواقد.'),

  ('cafetiere-turque-electrique', (select id from public.categories where slug = 'maison-cuisine'),
   'Cafetière turque électrique', 'مكينة قهوة تركية كهربائية',
   9800, 8400, 20, false, false,
   'Cafetière turque électrique 600W, prépare 4 tasses, arrêt automatique.',
   'مكينة قهوة تركية كهربائية 600 واط، تحضر 4 فناجين، إيقاف تلقائي.'),

  ('service-the-12',           (select id from public.categories where slug = 'maison-cuisine'),
   'Service à thé 12 pièces', 'طقم شاي 12 قطعة',
   7800, null, 16, false, false,
   'Service à thé traditionnel 12 pièces en porcelaine, design élégant.',
   'طقم شاي تقليدي من 12 قطعة من البورسلين، بتصميم أنيق.'),

  ('tapis-priere-confort',     (select id from public.categories where slug = 'maison-cuisine'),
   'Tapis de prière confort', 'سجادة صلاة مريحة',
   2400, null, 60, false, false,
   'Tapis de prière épais et confortable, avec pochette de transport.',
   'سجادة صلاة سميكة ومريحة مع حقيبة حمل.'),

  ('chemise-homme-lin',        (select id from public.categories where slug = 'vetements'),
   'Chemise homme en lin', 'قميص رجالي من الكتان',
   3900, null, 40, false, false,
   'Chemise homme en lin léger et respirant, coupe moderne.',
   'قميص رجالي من الكتان الخفيف والمريح، بقصة عصرية.'),

  ('robe-femme-elegante',      (select id from public.categories where slug = 'vetements'),
   'Robe femme élégante', 'فستان نسائي أنيق',
   5800, 4900, 25, false, false,
   'Robe femme élégante, tissu premium, idéale pour les occasions.',
   'فستان نسائي أنيق من قماش فاخر، مثالي للمناسبات.'),

  ('blouson-homme-premium',    (select id from public.categories where slug = 'vetements'),
   'Blouson homme premium', 'جاكيت رجالي فاخر',
   8900, null, 18, false, false,
   'Blouson homme en cuir synthétique, doublure chaude, finitions premium.',
   'جاكيت رجالي من الجلد الصناعي ببطانة دافئة وتشطيبات فاخرة.'),

  ('djellaba-moderne',         (select id from public.categories where slug = 'vetements'),
   'Djellaba moderne', 'جلابة عصرية',
   6500, null, 30, false, false,
   'Djellaba moderne et élégante, broderies traditionnelles, plusieurs tailles.',
   'جلابة عصرية وأنيقة بتطريزات تقليدية وبعدة مقاسات.'),

  ('baskets-running-homme',    (select id from public.categories where slug = 'chaussures'),
   'Baskets running homme', 'حذاء رياضي للرجال',
   7900, 6900, 20, false, true,
   'Baskets running légères avec semelle amortissante, confort toute la journée.',
   'حذاء رياضي خفيف بنعل ممتص للصدمات، مريح طوال اليوم.'),

  ('sandales-ete-cuir',        (select id from public.categories where slug = 'chaussures'),
   'Sandales été cuir', 'صنادل صيفية جلدية',
   3400, null, 35, false, false,
   'Sandales été en cuir véritable, confort et durabilité.',
   'صنادل صيفية من الجلد الأصلي، مريحة ومتينة.'),

  ('chaussures-cuir-homme',    (select id from public.categories where slug = 'chaussures'),
   'Chaussures cuir homme', 'حذاء جلد رجالي',
   9500, null, 12, false, false,
   'Chaussures homme en cuir véritable, semelle robuste, look classique.',
   'حذاء رجالي من الجلد الأصلي بنعل متين ومظهر كلاسيكي.'),

  ('ballon-football-5',        (select id from public.categories where slug = 'sports-loisirs'),
   'Ballon de football taille 5', 'كرة قدم مقاس 5',
   2900, null, 55, false, false,
   'Ballon de football taille 5, résistant à l''usure, idéal terrains et salles.',
   'كرة قدم مقاس 5، مقاومة للاهتراء، مثالية للملاعب والقاعات.'),

  ('tapis-yoga-6mm',           (select id from public.categories where slug = 'sports-loisirs'),
   'Tapis de yoga 6mm', 'سجادة يوجا 6 مم',
   4200, null, 32, false, false,
   'Tapis de yoga 6mm anti-dérapant, avec sangle de transport.',
   'سجادة يوجا 6 مم مانعة للانزلاق مع حزام حمل.'),

  ('ensemble-halteres-20kg',   (select id from public.categories where slug = 'sports-loisirs'),
   'Ensemble d''haltères 20 kg', 'طقم دمبلز 20 كجم',
   12500, null, 8, false, false,
   'Ensemble d''haltères 20 kg avec barres, disques et colliers de sécurité.',
   'طقم دمبلز 20 كجم مع أعمدة وأقراص وأقفال أمان.'),

  ('voiture-telecommandee',    (select id from public.categories where slug = 'jouets'),
   'Voiture télécommandée 4x4', 'سيارة تحكم عن بعد 4x4',
   5900, null, 20, false, false,
   'Voiture télécommandée 4x4, contrôle précis, vitesse élevée.',
   'سيارة تحكم عن بعد 4x4 بتحكم دقيق وسرعة عالية.'),

  ('puzzle-1000-pieces',       (select id from public.categories where slug = 'jouets'),
   'Puzzle éducatif 1000 pièces', 'لغز تعليمي 1000 قطعة',
   2200, null, 40, false, false,
   'Puzzle éducatif 1000 pièces, développe la concentration.',
   'لغز تعليمي من 1000 قطعة، ينمي التركيز.'),

  ('peluche-geante-1m',        (select id from public.categories where slug = 'jouets'),
   'Peluche géante 1m', 'دمية دب عملاقة 1 متر',
   3600, 2900, 15, false, false,
   'Peluche géante d''1 mètre, ultra-douce, parfaite pour offrir.',
   'دمية دب عملاقة بطول متر واحد، ناعمة جداً، مثالية كهدية.');

-- -----------------------------------------------------------------------------
-- Product images (2 per product, seeded placeholders — replace from admin)
-- -----------------------------------------------------------------------------
insert into public.product_images (product_id, url, display_order, is_primary)
select
  p.id,
  'https://picsum.photos/seed/velora-' || p.slug || '-1/800/800',
  0,
  true
from public.products p;

insert into public.product_images (product_id, url, display_order, is_primary)
select
  p.id,
  'https://picsum.photos/seed/velora-' || p.slug || '-2/800/800',
  1,
  false
from public.products p
where p.is_featured = true or p.is_best_seller = true;

-- -----------------------------------------------------------------------------
-- Product variants (for selected products)
-- -----------------------------------------------------------------------------
insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-A55-NOIR', 'Noir', 'أسود', '{"Couleur":"Noir","Color":"Black"}'::jsonb, 6
from public.products p where p.slug = 'samsung-galaxy-a55';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-A55-BLEU', 'Bleu', 'أزرق', '{"Couleur":"Bleu","Color":"Blue"}'::jsonb, 6
from public.products p where p.slug = 'samsung-galaxy-a55';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-CHEM-S', 'Taille S', 'مقاس S', '{"Taille":"S","Size":"S"}'::jsonb, 10
from public.products p where p.slug = 'chemise-homme-lin';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-CHEM-M', 'Taille M', 'مقاس M', '{"Taille":"M","Size":"M"}'::jsonb, 15
from public.products p where p.slug = 'chemise-homme-lin';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-CHEM-L', 'Taille L', 'مقاس L', '{"Taille":"L","Size":"L"}'::jsonb, 10
from public.products p where p.slug = 'chemise-homme-lin';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-CHEM-XL', 'Taille XL', 'مقاس XL', '{"Taille":"XL","Size":"XL"}'::jsonb, 5
from public.products p where p.slug = 'chemise-homme-lin';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-BASKET-42', 'Pointure 42', 'مقاس 42', '{"Pointure":"42","Size":"42"}'::jsonb, 6
from public.products p where p.slug = 'baskets-running-homme';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-BASKET-43', 'Pointure 43', 'مقاس 43', '{"Pointure":"43","Size":"43"}'::jsonb, 8
from public.products p where p.slug = 'baskets-running-homme';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-BASKET-44', 'Pointure 44', 'مقاس 44', '{"Pointure":"44","Size":"44"}'::jsonb, 6
from public.products p where p.slug = 'baskets-running-homme';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-DJEL-S', 'Taille S', 'مقاس S', '{"Taille":"S","Size":"S"}'::jsonb, 8
from public.products p where p.slug = 'djellaba-moderne';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-DJEL-M', 'Taille M', 'مقاس M', '{"Taille":"M","Size":"M"}'::jsonb, 12
from public.products p where p.slug = 'djellaba-moderne';

insert into public.product_variants (product_id, sku, name_fr, name_ar, options, stock)
select p.id, 'VEL-DJEL-L', 'Taille L', 'مقاس L', '{"Taille":"L","Size":"L"}'::jsonb, 10
from public.products p where p.slug = 'djellaba-moderne';

-- -----------------------------------------------------------------------------
-- Example orders (every status)
-- -----------------------------------------------------------------------------
insert into public.orders
  (order_number, customer_name, customer_phone, wilaya_id, commune, shipping_address, delivery_type, notes, subtotal, delivery_fee, total_amount, status, created_at)
values
  ('VEL-01000', 'Mohamed Benali',   '0550123456', 16, 'Bab Ezzouar', 'Cité 5 Juillet, Bt 12, n° 4', 'home', null, 91400, 400, 91800, 'pending',    now() - interval '2 hours'),
  ('VEL-01001', 'Amina Zerrouki',   '0661234567', 31, 'Bir El Djir', 'Rue Ahmed Zabana, n° 18', 'home', null, 14700, 500, 15200, 'confirmed',  now() - interval '5 hours'),
  ('VEL-01002', 'Yacine Hamdani',   '0770234567', 19, 'El Eulma',    'Quartier El Hamri, Bt 3', 'stop_desk', 'Appeler avant livraison', 37700, 350, 38050, 'preparing', now() - interval '1 day'),
  ('VEL-01003', 'Khadidja Boudiaf', '0550987654', 16, 'Bab El Oued', 'Rue Colonel Amirouche, n° 22', 'home', null, 11200, 400, 11600, 'shipped',   now() - interval '2 days'),
  ('VEL-01004', 'Omar Meziane',     '0665544332', 25, 'El Khroub',   'Cité El Nasr, Bt 8, n° 15', 'home', null, 14700, 500, 15200, 'delivered', now() - interval '4 days'),
  ('VEL-01005', 'Salima Bouzid',    '0770112233',  9, 'Boufarik',    'Route de Blida, n° 45', 'home', null, 10300, 500, 10800, 'cancelled', now() - interval '6 days'),
  ('VEL-01006', 'Karim Haddad',     '0550778899',  6, 'Akbou',       'Cité 20 Août, Bt 5', 'home', null, 26000, 500, 26500, 'delivered', now() - interval '8 days'),
  ('VEL-01007', 'Lila Benkhelifa',  '0660998877',  2, 'Ténès',       'Centre-ville, n° 7', 'stop_desk', null, 10600, 350, 10950, 'pending',   now() - interval '30 minutes');

-- Order items
insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 82900, 1, 82900
from public.orders o cross join public.products p
where o.order_number = 'VEL-01000' and p.slug = 'samsung-galaxy-a55';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 8500, 1, 8500
from public.orders o cross join public.products p
where o.order_number = 'VEL-01000' and p.slug = 'ecouteurs-jbl-tune';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 4900, 2, 9800
from public.orders o cross join public.products p
where o.order_number = 'VEL-01001' and p.slug = 'parfum-homme-100';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 4900, 1, 4900
from public.orders o cross join public.products p
where o.order_number = 'VEL-01001' and p.slug = 'robe-femme-elegante';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 29900, 1, 29900
from public.orders o cross join public.products p
where o.order_number = 'VEL-01002' and p.slug = 'machine-cafe-expresso';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 7800, 1, 7800
from public.orders o cross join public.products p
where o.order_number = 'VEL-01002' and p.slug = 'service-the-12';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 6400, 1, 6400
from public.orders o cross join public.products p
where o.order_number = 'VEL-01003' and p.slug = 'mixeur-plongeant';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 2400, 2, 4800
from public.orders o cross join public.products p
where o.order_number = 'VEL-01003' and p.slug = 'tapis-priere-confort';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 6900, 1, 6900
from public.orders o cross join public.products p
where o.order_number = 'VEL-01004' and p.slug = 'baskets-running-homme';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 3900, 2, 7800
from public.orders o cross join public.products p
where o.order_number = 'VEL-01004' and p.slug = 'chemise-homme-lin';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 4900, 1, 4900
from public.orders o cross join public.products p
where o.order_number = 'VEL-01005' and p.slug = 'robe-femme-elegante';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 5400, 1, 5400
from public.orders o cross join public.products p
where o.order_number = 'VEL-01005' and p.slug = 'parfum-femme-80';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 10900, 2, 21800
from public.orders o cross join public.products p
where o.order_number = 'VEL-01006' and p.slug = 'montre-connectee-s9';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 4200, 1, 4200
from public.orders o cross join public.products p
where o.order_number = 'VEL-01006' and p.slug = 'tapis-yoga-6mm';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 8400, 1, 8400
from public.orders o cross join public.products p
where o.order_number = 'VEL-01007' and p.slug = 'cafetiere-turque-electrique';

insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, total_price)
select o.id, p.id, p.name_fr, 2200, 1, 2200
from public.orders o cross join public.products p
where o.order_number = 'VEL-01007' and p.slug = 'puzzle-1000-pieces';

-- -----------------------------------------------------------------------------
-- Customers (derived from the orders above)
-- -----------------------------------------------------------------------------
insert into public.customers (phone, full_name, wilaya_id, total_orders, total_spent, last_order_at) values
  ('0550123456', 'Mohamed Benali',   16, 1, 91800, now() - interval '2 hours'),
  ('0661234567', 'Amina Zerrouki',   31, 1, 15200, now() - interval '5 hours'),
  ('0770234567', 'Yacine Hamdani',   19, 1, 38050, now() - interval '1 day'),
  ('0550987654', 'Khadidja Boudiaf', 16, 1, 11600, now() - interval '2 days'),
  ('0665544332', 'Omar Meziane',     25, 1, 15200, now() - interval '4 days'),
  ('0770112233', 'Salima Bouzid',     9, 1, 10800, now() - interval '6 days'),
  ('0550778899', 'Karim Haddad',      6, 1, 26500, now() - interval '8 days'),
  ('0660998877', 'Lila Benkhelifa',   2, 1, 10950, now() - interval '30 minutes')
on conflict (phone) do update set
  full_name = excluded.full_name,
  wilaya_id = excluded.wilaya_id,
  total_orders = public.customers.total_orders + excluded.total_orders,
  total_spent = public.customers.total_spent + excluded.total_spent,
  last_order_at = excluded.last_order_at;
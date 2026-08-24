-- Disable triggers & integrity checks momentarily for clean restore
SET check_function_bodies = false;

--------------------------------------------------
-- 1. SCHEMAS & SEQUENCES
--------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.food_mappings_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.modifiers_id_seq;

-- Table: customer_groups
CREATE TABLE IF NOT EXISTS public.customer_groups (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT customer_groups_pkey PRIMARY KEY (id)
);

-- Table: food_categories
CREATE TABLE IF NOT EXISTS public.food_categories (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_categories_pkey PRIMARY KEY (id)
);

-- Table: food_groups
CREATE TABLE IF NOT EXISTS public.food_groups (
    id bigint NOT NULL,
    name text NOT NULL,
    CONSTRAINT food_groups_pkey PRIMARY KEY (id)
);

-- Table: food_mappings
CREATE TABLE IF NOT EXISTS public.food_mappings (
    id integer NOT NULL DEFAULT nextval('food_mappings_id_seq'::regclass),
    food_id bigint NULL,
    stock_name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT food_mappings_pkey PRIMARY KEY (id)
);

-- Table: food_prices
CREATE TABLE IF NOT EXISTS public.food_prices (
    id bigint NOT NULL,
    food_id bigint NOT NULL,
    customer_group_id bigint NOT NULL,
    price numeric NOT NULL DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_prices_pkey PRIMARY KEY (id)
);

-- Table: food_stocks
CREATE TABLE IF NOT EXISTS public.food_stocks (
    id bigint NOT NULL,
    food_name text NOT NULL,
    quantity numeric NOT NULL DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_stocks_pkey PRIMARY KEY (id)
);

-- Table: foods
CREATE TABLE IF NOT EXISTS public.foods (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    requires_stock boolean DEFAULT true NULL,
    category_id bigint NULL,
    price numeric DEFAULT 0 NULL,
    group_id bigint NULL,
    CONSTRAINT foods_pkey PRIMARY KEY (id)
);

-- Table: locations
CREATE TABLE IF NOT EXISTS public.locations (
    id bigint NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT locations_pkey PRIMARY KEY (id)
);

-- Table: modifiers
CREATE TABLE IF NOT EXISTS public.modifiers (
    id integer NOT NULL DEFAULT nextval('modifiers_id_seq'::regclass),
    name text NOT NULL,
    price numeric NOT NULL DEFAULT 10,
    updated_at timestamp without time zone DEFAULT now() NULL,
    CONSTRAINT modifiers_pkey PRIMARY KEY (id)
);

-- Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
    id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    customer_group text NULL,
    total_price numeric NULL,
    total_qty bigint DEFAULT 0 NULL,
    items jsonb NULL,
    phone text NULL,
    location_name text NULL,
    zone_name text NULL,
    order_date date NULL,
    status text DEFAULT 'pending'::text NULL,
    customer_group_id bigint NULL,
    note text NULL,
    customer_phone character varying DEFAULT NULL::character varying NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

-- Table: zones
CREATE TABLE IF NOT EXISTS public.zones (
    id bigint NOT NULL,
    name text NOT NULL,
    location_id bigint NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT zones_pkey PRIMARY KEY (id)
);

--------------------------------------------------
-- 2. DATA INSERTS
--------------------------------------------------

-- Data for table: customer_groups
INSERT INTO public.customer_groups (id, name, created_at) VALUES (1, 'ชาวบ้าน', '2026-08-11 08:52:38.836177+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customer_groups (id, name, created_at) VALUES (2, 'นักท่องเที่ยว', '2026-08-11 08:52:38.836177+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customer_groups (id, name, created_at) VALUES (3, 'สบายดี', '2026-08-11 08:52:38.836177+00') ON CONFLICT (id) DO NOTHING;

-- Data for table: food_groups
INSERT INTO public.food_groups (id, name) VALUES (2, 'ต้ม / แกง') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (3, 'ทอด / ยำ') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (5, 'ลาบ / ก้อย / ซอยจุ๊') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (6, 'เมนูพิเศษ') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (7, 'ส้มตำ') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (1, 'ข้าวกล่อง') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (4, 'ข้าว / ข้าวต้ม') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_groups (id, name) VALUES (8, 'ลูกค้าฝากซื้อ') ON CONFLICT (id) DO NOTHING;

-- Data for table: food_mappings
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (1, 20, 'กระดูกอ่อน', '2026-08-13 03:55:04.867589+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (2, 38, 'คอหมูย่าง', '2026-08-13 03:55:18.211626+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (3, 17, 'คอหมูย่าง', '2026-08-13 03:55:35.516915+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (4, 22, 'เครื่องในเนื้อ', '2026-08-13 03:55:49.309796+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (6, 39, 'เนื้อแดดเดียว', '2026-08-13 03:56:16.107925+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (7, 40, 'หมูแดดเดียว', '2026-08-13 03:56:31.544449+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (8, 21, 'เครื่องในเนื้อ', '2026-08-17 09:00:56.339639+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (9, 38, 'คอหมูย่าง', '2026-08-17 15:17:45.352619+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_mappings (id, food_id, stock_name, created_at) VALUES (10, 17, 'คอหมูย่าง', '2026-08-17 15:17:58.103798+00') ON CONFLICT (id) DO NOTHING;

-- Data for table: food_prices
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (3, 2, 2, 10.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (4, 2, 3, 10.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (5, 3, 2, 10.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (6, 3, 3, 10.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (10, 5, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (11, 6, 2, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (12, 6, 3, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (15, 8, 2, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (17, 9, 2, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (21, 11, 2, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (22, 11, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (23, 12, 2, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (24, 12, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (25, 13, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (26, 13, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (27, 14, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (28, 14, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (29, 15, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (30, 15, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (31, 16, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (32, 16, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (33, 17, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (34, 17, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (36, 18, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (37, 19, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (38, 19, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (39, 20, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (40, 20, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (42, 21, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (43, 22, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (44, 22, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (45, 23, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (46, 23, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (47, 24, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (48, 24, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (49, 25, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (50, 25, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (51, 26, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (52, 26, 3, 100.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (53, 27, 2, 200.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (61, 31, 2, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (63, 32, 2, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (70, 16, 1, 80.00, '2026-08-11 10:14:34.321793+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (71, 14, 1, 80.00, '2026-08-11 10:14:36.586932+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (72, 24, 1, 80.00, '2026-08-11 10:14:38.252604+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (73, 23, 1, 80.00, '2026-08-11 10:14:40.523367+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (74, 27, 1, 150.00, '2026-08-11 10:14:50.52507+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (75, 20, 1, 80.00, '2026-08-11 10:14:53.28286+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (76, 21, 1, 80.00, '2026-08-11 10:14:55.692155+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (77, 22, 1, 80.00, '2026-08-11 10:14:57.758401+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (78, 25, 1, 80.00, '2026-08-11 10:15:00.67169+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (79, 18, 1, 80.00, '2026-08-11 10:15:02.881616+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (80, 17, 1, 80.00, '2026-08-11 10:15:05.766846+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (81, 26, 1, 80.00, '2026-08-11 10:15:07.676343+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (82, 19, 1, 80.00, '2026-08-11 10:15:20.480896+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (83, 15, 1, 80.00, '2026-08-11 10:15:23.518828+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (84, 28, 1, 200.00, '2026-08-11 10:16:10.78391+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (85, 33, 2, 80.00, '2026-08-11 10:44:20.240416+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (86, 33, 1, 70.00, '2026-08-11 10:44:24.023273+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (55, 28, 2, 250.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (87, 32, 1, 60.00, '2026-08-11 13:33:06.35366+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (88, 30, 1, 50.00, '2026-08-11 13:33:11.557127+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (90, 29, 1, 50.00, '2026-08-11 13:33:20.182613+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (41, 21, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (57, 29, 2, 50.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (65, 33, 3, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (56, 28, 3, 220.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (92, 36, 1, 80.00, '2026-08-11 13:44:52.301168+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (95, 3, 1, 10.00, '2026-08-11 13:45:32.147197+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (96, 2, 1, 10.00, '2026-08-11 13:45:34.446333+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (98, 38, 2, 120.00, '2026-08-13 03:30:37.67561+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (99, 38, 3, 100.00, '2026-08-13 03:30:37.67561+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (100, 39, 1, 80.00, '2026-08-13 03:41:37.856373+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (101, 39, 2, 120.00, '2026-08-13 03:41:37.856373+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (102, 39, 3, 100.00, '2026-08-13 03:41:37.856373+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (103, 40, 1, 80.00, '2026-08-13 03:41:49.35398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (104, 40, 2, 120.00, '2026-08-13 03:41:49.35398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (105, 40, 3, 100.00, '2026-08-13 03:41:49.35398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (108, 41, 3, 80.00, '2026-08-17 08:05:24.783482+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (54, 27, 3, 200.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (35, 18, 2, 120.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (64, 32, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (97, 38, 1, 80.00, '2026-08-13 03:30:37.67561+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (106, 41, 1, 60.00, '2026-08-17 08:05:24.783482+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (9, 5, 2, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (19, 10, 2, 80.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (111, 13, 1, 80.00, '2026-08-18 02:15:36.670871+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (89, 31, 1, 60.00, '2026-08-11 13:33:14.404211+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (112, 11, 1, 100.00, '2026-08-18 07:33:54.844962+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (113, 8, 1, 50.00, '2026-08-18 07:34:01.933872+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (16, 8, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (110, 5, 1, 60.00, '2026-08-18 02:15:18.797085+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (114, 12, 1, 100.00, '2026-08-18 07:34:18.374272+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (115, 6, 1, 60.00, '2026-08-18 07:34:29.240868+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (116, 10, 1, 70.00, '2026-08-18 07:34:37.397991+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (20, 10, 3, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (13, 7, 2, 70.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (18, 9, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (117, 7, 1, 60.00, '2026-08-18 07:34:43.053056+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (14, 7, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (118, 4, 1, 50.00, '2026-08-18 07:35:01.388627+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (8, 4, 3, 50.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (7, 4, 2, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (119, 9, 1, 60.00, '2026-08-18 07:35:12.249913+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (93, 36, 2, 120.00, '2026-08-11 13:44:52.301168+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (94, 36, 3, 100.00, '2026-08-11 13:44:52.301168+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (107, 41, 2, 80.00, '2026-08-17 08:05:24.783482+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (59, 30, 2, 50.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (60, 30, 3, 50.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (62, 31, 3, 60.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (58, 29, 3, 50.00, '2026-08-11 08:52:59.179763+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (120, 42, 1, 20.00, '2026-08-18 08:11:07.38761+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (121, 42, 2, 20.00, '2026-08-18 08:11:07.38761+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (122, 42, 3, 20.00, '2026-08-18 08:11:07.38761+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (123, 43, 1, 25.00, '2026-08-18 08:11:37.743087+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (124, 43, 2, 25.00, '2026-08-18 08:11:37.743087+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (125, 43, 3, 25.00, '2026-08-18 08:11:37.743087+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (126, 44, 1, 20.00, '2026-08-18 08:13:37.60673+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (127, 44, 2, 20.00, '2026-08-18 08:13:37.60673+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (128, 44, 3, 20.00, '2026-08-18 08:13:37.60673+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (129, 45, 1, 10.00, '2026-08-18 08:13:50.302974+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (130, 45, 2, 10.00, '2026-08-18 08:13:50.302974+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (131, 45, 3, 10.00, '2026-08-18 08:13:50.302974+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (132, 46, 1, 50.00, '2026-08-18 14:14:15.184398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (133, 46, 2, 50.00, '2026-08-18 14:14:15.184398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (134, 46, 3, 50.00, '2026-08-18 14:14:15.184398+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (135, 47, 1, 40.00, '2026-08-18 23:06:22.556788+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (136, 47, 2, 40.00, '2026-08-18 23:06:22.556788+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (137, 47, 3, 40.00, '2026-08-18 23:06:22.556788+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (138, 48, 1, 50.00, '2026-08-18 23:07:58.056448+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (139, 48, 2, 50.00, '2026-08-18 23:07:58.056448+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (140, 48, 3, 50.00, '2026-08-18 23:07:58.056448+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (141, 49, 1, 60.00, '2026-08-18 23:12:33.029157+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (142, 49, 2, 60.00, '2026-08-18 23:12:33.029157+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (143, 49, 3, 60.00, '2026-08-18 23:12:33.029157+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (144, 50, 1, 60.00, '2026-08-19 06:42:16.273926+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (145, 50, 2, 60.00, '2026-08-19 06:42:16.273926+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (146, 50, 3, 60.00, '2026-08-19 06:42:16.273926+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (147, 51, 1, 60.00, '2026-08-19 12:52:59.214489+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (148, 51, 2, 60.00, '2026-08-19 12:52:59.214489+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (149, 51, 3, 60.00, '2026-08-19 12:52:59.214489+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (150, 52, 1, 50.00, '2026-08-19 13:25:13.085693+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (151, 52, 2, 50.00, '2026-08-19 13:25:13.085693+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (152, 52, 3, 50.00, '2026-08-19 13:25:13.085693+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (153, 53, 1, 50.00, '2026-08-19 13:25:55.158905+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (154, 53, 2, 50.00, '2026-08-19 13:25:55.158905+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (155, 53, 3, 50.00, '2026-08-19 13:25:55.158905+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (156, 54, 1, 10.00, '2026-08-19 13:48:03.172285+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (157, 54, 2, 10.00, '2026-08-19 13:48:03.172285+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (158, 54, 3, 10.00, '2026-08-19 13:48:03.172285+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (159, 55, 1, 60.00, '2026-08-19 13:48:59.160421+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (160, 55, 2, 70.00, '2026-08-19 13:48:59.160421+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_prices (id, food_id, customer_group_id, price, created_at) VALUES (161, 55, 3, 60.00, '2026-08-19 13:48:59.160421+00') ON CONFLICT (id) DO NOTHING;

-- Data for table: food_stocks
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (2, 'ต้มเครื่องในเนื้อ', 13, '2026-08-17 15:08:07.417+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (3, 'ต้มกระดูกอ่อน', 10, '2026-08-17 15:08:22.768+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (4, 'หมูกรอบ', 10, '2026-08-17 15:08:33.301+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (6, 'คอหมูย่าง', 6, '2026-08-20 11:31:06.556+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (5, 'หมูแดดเดียว', 7, '2026-08-20 11:31:05.431+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.food_stocks (id, food_name, quantity, updated_at) VALUES (1, 'เนื้อแดดเดียว', -3, '2026-08-20 11:31:04.933+00') ON CONFLICT (id) DO NOTHING;

-- Data for table: foods
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (32, 'กระเพราหมูกรอบ', '2026-08-11 08:52:59.179763+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (30, 'ข้าวไข่เจียว', '2026-08-11 08:52:59.179763+00', false, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (31, 'ข้าวผัดทะเล', '2026-08-11 08:52:59.179763+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (29, 'ข้าวผัดหมู', '2026-08-11 08:52:59.179763+00', false, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (46, 'กระเพราหมูสับ', '2026-08-18 14:14:14.927347+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (48, 'ซุปหน่อไม้', '2026-08-18 23:07:57.929234+00', true, 6, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (50, 'ข้าวผัดปลาหมึก', '2026-08-19 06:42:15.90542+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (52, 'หมูกระเทียม', '2026-08-19 13:25:12.821532+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (54, 'ขนมจีน', '2026-08-19 13:48:03.012864+00', true, 4, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (25, 'ต้มยำรวมมิตร', '2026-08-11 08:52:59.179763+00', false, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (23, 'แกงอ่อมหมู', '2026-08-11 08:52:59.179763+00', false, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (24, 'แกงอ่อมเนื้อ', '2026-08-11 08:52:59.179763+00', false, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (41, 'ต้มจืด ไข่น้ำ', '2026-08-17 08:05:24.586437+00', true, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (22, 'ต้มขมเครื่องในเนื้อ', '2026-08-11 08:52:59.179763+00', true, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (21, 'ต้มแซ่บเครื่องในเนื้อ', '2026-08-11 08:52:59.179763+00', true, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (20, 'แซ่บกระดูกอ่อน', '2026-08-11 08:52:59.179763+00', true, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (40, 'หมูแดดเดียว', '2026-08-13 03:41:49.237761+00', true, 3, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (39, 'เนื้อแดดเดียว', '2026-08-13 03:41:37.725259+00', true, 3, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (26, 'ยำวุ้นเส้นรวมมิตร', '2026-08-11 08:52:59.179763+00', false, 3, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (36, 'ยำมาม่ารวมมิตร', '2026-08-11 13:44:52.046247+00', false, 3, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (3, 'ข้าวสวย', '2026-08-11 08:52:59.179763+00', false, 4, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (2, 'ข้าวเหนียว', '2026-08-11 08:52:59.179763+00', false, 4, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (45, 'น้ำเปล่าขวดเล็ก', '2026-08-18 08:13:50.162144+00', true, 6, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (44, 'น้ำเปล่าขวดใหญ่', '2026-08-18 08:13:37.468162+00', true, 6, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (33, 'กระเพราไข่เยี่ยวม้า', '2026-08-11 08:52:59.179763+00', false, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (47, 'น้ำอัดลม 1.25L', '2026-08-18 23:06:22.315459+00', true, 8, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (49, 'กระเพราเนื้อ', '2026-08-18 23:12:32.781241+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (51, 'คะน้าหมูกรอบ', '2026-08-19 12:52:58.895408+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (53, 'กระเพราไก่', '2026-08-19 13:25:54.97453+00', true, 1, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (55, 'ต้มจืดหมูสับ', '2026-08-19 13:48:58.990562+00', true, 2, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (19, 'ลวกจิ้ม', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (15, 'ลาบเนื้อ', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (13, 'ลาบหมู', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (38, 'คอหมูย่าง', '2026-08-13 03:30:37.461178+00', true, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (16, 'ก้อยเนื้อ', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (14, 'ก้อยหมู', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.foods (id, name, created_at, requires_stock, category_id, price, group_id) VALUES (27, 'ซอยจุ๊', '2026-08-11 08:52:59.179763+00', false, 5, 0, NULL) ON CONFLICT (id) DO NOTHING;

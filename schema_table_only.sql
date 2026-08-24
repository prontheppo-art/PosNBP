-- Disable foreign key checks momentarily for smooth execution
SET check_function_bodies = false;

-- 1. customer_groups
CREATE TABLE IF NOT EXISTS public.customer_groups (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT customer_groups_pkey PRIMARY KEY (id)
);

-- 2. food_categories
CREATE TABLE IF NOT EXISTS public.food_categories (
    id bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_categories_pkey PRIMARY KEY (id)
);

-- 3. food_groups
CREATE TABLE IF NOT EXISTS public.food_groups (
    id bigint NOT NULL,
    name text NOT NULL,
    CONSTRAINT food_groups_pkey PRIMARY KEY (id)
);

-- 4. food_mappings
CREATE SEQUENCE IF NOT EXISTS public.food_mappings_id_seq;

CREATE TABLE IF NOT EXISTS public.food_mappings (
    id integer NOT NULL DEFAULT nextval('food_mappings_id_seq'::regclass),
    food_id bigint NULL,
    stock_name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT food_mappings_pkey PRIMARY KEY (id)
);

-- 5. food_prices
CREATE TABLE IF NOT EXISTS public.food_prices (
    id bigint NOT NULL,
    food_id bigint NOT NULL,
    customer_group_id bigint NOT NULL,
    price numeric NOT NULL DEFAULT 0.00,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_prices_pkey PRIMARY KEY (id)
);

-- 6. food_stocks
CREATE TABLE IF NOT EXISTS public.food_stocks (
    id bigint NOT NULL,
    food_name text NOT NULL,
    quantity numeric NOT NULL DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT food_stocks_pkey PRIMARY KEY (id)
);

-- 7. foods
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

-- 8. locations
CREATE TABLE IF NOT EXISTS public.locations (
    id bigint NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT locations_pkey PRIMARY KEY (id)
);

-- 9. modifiers
CREATE SEQUENCE IF NOT EXISTS public.modifiers_id_seq;

CREATE TABLE IF NOT EXISTS public.modifiers (
    id integer NOT NULL DEFAULT nextval('modifiers_id_seq'::regclass),
    name text NOT NULL,
    price numeric NOT NULL DEFAULT 10,
    updated_at timestamp without time zone DEFAULT now() NULL,
    CONSTRAINT modifiers_pkey PRIMARY KEY (id)
);

-- 10. orders
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

-- 11. zones
CREATE TABLE IF NOT EXISTS public.zones (
    id bigint NOT NULL,
    name text NOT NULL,
    location_id bigint NULL,
    created_at timestamp with time zone DEFAULT now() NULL,
    CONSTRAINT zones_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."customer_groups" (
    "id" bigint,
    "name" character varying,
    "created_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."food_categories" (
    "id" bigint,
    "name" character varying,
    "created_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."food_groups" (
    "id" bigint,
    "name" text
);

CREATE TABLE IF NOT EXISTS public."food_mappings" (
    "id" integer,
    "food_id" bigint,
    "stock_name" text,
    "created_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."food_prices" (
    "id" bigint,
    "food_id" bigint,
    "customer_group_id" bigint,
    "price" numeric,
    "created_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."food_stocks" (
    "id" bigint,
    "food_name" text,
    "quantity" numeric,
    "updated_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."foods" (
    "id" bigint,
    "name" character varying,
    "created_at" timestamp with time zone,
    "requires_stock" boolean,
    "category_id" bigint,
    "price" numeric,
    "group_id" bigint,
    "price_1" numeric,
    "price_2" numeric,
    "price_3" numeric
);

CREATE TABLE IF NOT EXISTS public."locations" (
    "id" bigint,
    "name" text,
    "created_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public."modifiers" (
    "id" integer,
    "name" text,
    "price" numeric,
    "updated_at" timestamp without time zone
);

CREATE TABLE IF NOT EXISTS public."orders" (
    "id" bigint,
    "created_at" timestamp with time zone,
    "customer_group" text,
    "total_price" numeric,
    "total_qty" bigint,
    "items" jsonb,
    "phone" text,
    "location_name" text,
    "zone_name" text,
    "order_date" date,
    "status" text,
    "customer_group_id" bigint,
    "note" text,
    "customer_phone" character varying,
    "location_id" bigint,
    "zone_id" bigint
);

CREATE TABLE IF NOT EXISTS public."zones" (
    "id" bigint,
    "name" text,
    "location_id" bigint,
    "created_at" timestamp with time zone
);

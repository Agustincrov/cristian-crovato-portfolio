


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE TYPE public.enum_works_listing_type AS ENUM (
    'commission',
    'available'
);



CREATE TYPE public.enum_works_status AS ENUM (
    'published',
    'draft'
);


SET default_tablespace = '';

SET default_table_access_method = heap;


CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    sizes_thumbnail_url character varying,
    sizes_thumbnail_width numeric,
    sizes_thumbnail_height numeric,
    sizes_thumbnail_mime_type character varying,
    sizes_thumbnail_filesize numeric,
    sizes_thumbnail_filename character varying,
    sizes_card_url character varying,
    sizes_card_width numeric,
    sizes_card_height numeric,
    sizes_card_mime_type character varying,
    sizes_card_filesize numeric,
    sizes_card_filename character varying,
    sizes_full_url character varying,
    sizes_full_width numeric,
    sizes_full_height numeric,
    sizes_full_mime_type character varying,
    sizes_full_filesize numeric,
    sizes_full_filename character varying
);



CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;



CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);



CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;



CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);



CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;



CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    works_id integer
);



CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;



CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);



CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;



CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);



CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;



CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);



CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;



CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);



CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;



CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);



CREATE TABLE public.works (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    description jsonb,
    materials character varying,
    dimensions character varying,
    listing_type public.enum_works_listing_type DEFAULT 'commission'::public.enum_works_listing_type NOT NULL,
    price_u_s_d numeric,
    production_time character varying,
    status public.enum_works_status DEFAULT 'draft'::public.enum_works_status NOT NULL,
    meta_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    price_a_r_s numeric
);



CREATE SEQUENCE public.works_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.works_id_seq OWNED BY public.works.id;



CREATE TABLE public.works_photos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL
);



ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);



ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);



ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);



ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);



ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);



ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);



ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);



ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);



ALTER TABLE ONLY public.works ALTER COLUMN id SET DEFAULT nextval('public.works_id_seq'::regclass);



ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.works_photos
    ADD CONSTRAINT works_photos_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_pkey PRIMARY KEY (id);



CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);



CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);



CREATE INDEX media_sizes_card_sizes_card_filename_idx ON public.media USING btree (sizes_card_filename);



CREATE INDEX media_sizes_full_sizes_full_filename_idx ON public.media USING btree (sizes_full_filename);



CREATE INDEX media_sizes_thumbnail_sizes_thumbnail_filename_idx ON public.media USING btree (sizes_thumbnail_filename);



CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);



CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);



CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);



CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);



CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);



CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");



CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);



CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);



CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);



CREATE INDEX payload_locked_documents_rels_works_id_idx ON public.payload_locked_documents_rels USING btree (works_id);



CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);



CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);



CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);



CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);



CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);



CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");



CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);



CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);



CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);



CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);



CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);



CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);



CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);



CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);



CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);



CREATE INDEX works_created_at_idx ON public.works USING btree (created_at);



CREATE INDEX works_photos_image_idx ON public.works_photos USING btree (image_id);



CREATE INDEX works_photos_order_idx ON public.works_photos USING btree (_order);



CREATE INDEX works_photos_parent_id_idx ON public.works_photos USING btree (_parent_id);



CREATE UNIQUE INDEX works_slug_idx ON public.works USING btree (slug);



CREATE INDEX works_updated_at_idx ON public.works USING btree (updated_at);



ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_works_fk FOREIGN KEY (works_id) REFERENCES public.works(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.works_photos
    ADD CONSTRAINT works_photos_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;



ALTER TABLE ONLY public.works_photos
    ADD CONSTRAINT works_photos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.works(id) ON DELETE CASCADE;





--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

-- Started on 2026-03-07 20:05:00

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

--
-- TOC entry 2 (class 3079 OID 672867)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3141 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 672950)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 673041)
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    filename text NOT NULL,
    original_name text,
    url text NOT NULL,
    public_id text,
    file_type character varying(50),
    size integer,
    alt_text text,
    uploader_id uuid,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.media OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 672991)
-- Name: post_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_categories (
    post_id uuid NOT NULL,
    category_id uuid NOT NULL
);


ALTER TABLE public.post_categories OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 673021)
-- Name: post_revisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_revisions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid,
    title text,
    body text,
    author_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.post_revisions OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 673006)
-- Name: post_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_tags (
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL
);


ALTER TABLE public.post_tags OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 672970)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    body text,
    body_html text,
    excerpt text,
    status character varying(20) DEFAULT 'draft'::character varying,
    author_id uuid,
    featured_image text,
    featured_image_alt text,
    meta_title character varying(255),
    meta_description text,
    views integer DEFAULT 0,
    reading_time integer DEFAULT 0,
    published_at timestamp without time zone,
    scheduled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 672928)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_token text NOT NULL,
    last_active timestamp without time zone DEFAULT now() NOT NULL,
    idle_timeout integer DEFAULT 1800 NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    user_agent text,
    ip_address text
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 672962)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 672918)
-- Name: token_blacklist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token_blacklist (
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.token_blacklist OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 672904)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'author'::character varying,
    avatar_url text,
    bio text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3129 (class 0 OID 672950)
-- Dependencies: 204
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, created_at) FROM stdin;
d00919e8-ad95-4f65-9920-fe1c265da9a1	Business Strategy	business-strategy	\N	2026-03-07 19:04:13.259243
6f5d6846-126c-408d-b392-e10aad23e707	Technology	technology	\N	2026-03-07 19:17:20.780756
66b52069-ad88-46c0-9148-0f56d63f89b9	Public Sector	public-sector	\N	2026-03-07 19:18:02.42623
\.


--
-- TOC entry 3135 (class 0 OID 673041)
-- Dependencies: 210
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, filename, original_name, url, public_id, file_type, size, alt_text, uploader_id, uploaded_at) FROM stdin;
52a99da0-6204-4170-b867-09ca9193dbf7	1772890614176-s8voerdt.png	Screenshot 2026-02-21 195226.png	http://localhost:5000/uploads/1772890614176-s8voerdt.png	1772890614176-s8voerdt.png	image/png	604640	\N	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:06:54.206724
\.


--
-- TOC entry 3132 (class 0 OID 672991)
-- Dependencies: 207
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_categories (post_id, category_id) FROM stdin;
98404c40-65fa-4ff7-8504-d7ed72b36036	d00919e8-ad95-4f65-9920-fe1c265da9a1
c3b18e7b-7c3d-47be-82d2-2206ce520ba9	66b52069-ad88-46c0-9148-0f56d63f89b9
6dc869ef-77b0-4425-b9fc-97a4f2fee668	6f5d6846-126c-408d-b392-e10aad23e707
\.


--
-- TOC entry 3134 (class 0 OID 673021)
-- Dependencies: 209
-- Data for Name: post_revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_revisions (id, post_id, title, body, author_id, created_at) FROM stdin;
84c27b2d-963e-4b5e-a63f-a56ac61a6490	98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:07:17.761937
c35b8c59-7e23-4e06-b400-1adf943a4808	98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.\n![Screenshot 2026-02-21 195226.png](http://localhost:5000/uploads/1772890614176-s8voerdt.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:08:26.978788
a49c5405-cb03-4e05-8bef-3ef82b8619c1	6dc869ef-77b0-4425-b9fc-97a4f2fee668	The Role of AI in Automated Document Classification	Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:19:13.9718
\.


--
-- TOC entry 3133 (class 0 OID 673006)
-- Dependencies: 208
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_tags (post_id, tag_id) FROM stdin;
\.


--
-- TOC entry 3131 (class 0 OID 672970)
-- Dependencies: 206
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, slug, body, body_html, excerpt, status, author_id, featured_image, featured_image_alt, meta_title, meta_description, views, reading_time, published_at, scheduled_at, created_at, updated_at, deleted_at) FROM stdin;
c3b18e7b-7c3d-47be-82d2-2206ce520ba9	Transitioning to Paperless: A Roadmap for Government Bodies	transitioning-to-paperless-a-roadmap-for-government-bodies	A step-by-step guide for public sector organizations to migrate delicate historical archives into secure digital repositories.	<p>A step-by-step guide for public sector organizations to migrate delicate historical archives into secure digital repositories.</p>\n	Transitioning to Paperless: A Roadmap for Government Bodies	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2340&auto=format&fit=crop				8	1	2026-03-07 19:18:49.891	\N	2026-03-07 19:18:49.891912	2026-03-07 19:18:49.891912	\N
6dc869ef-77b0-4425-b9fc-97a4f2fee668	The Role of AI in Automated Document Classification	the-role-of-ai-in-automated-document-classification	Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.	<p>Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.</p>\n	The Role of AI in Automated Document Classification	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop				6	1	2026-03-07 19:17:46.097	\N	2026-03-07 19:17:46.099547	2026-03-07 19:19:13.975315	\N
98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	unlocking-roi-with-enterprise-content-management-ecm	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.\n	<p>Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.</p>\n	Unlocking ROI with Enterprise Content Management (ECM)	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&amp;w=2426&amp;auto=format&amp;fit=crop				8	1	2026-03-07 19:08:40.470819	\N	2026-03-07 19:04:17.057562	2026-03-07 19:08:40.470819	\N
\.


--
-- TOC entry 3128 (class 0 OID 672928)
-- Dependencies: 203
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, session_token, last_active, idle_timeout, expires_at, created_at, user_agent, ip_address) FROM stdin;
\.


--
-- TOC entry 3130 (class 0 OID 672962)
-- Dependencies: 205
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, slug) FROM stdin;
\.


--
-- TOC entry 3127 (class 0 OID 672918)
-- Dependencies: 202
-- Data for Name: token_blacklist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token_blacklist (token, expires_at, created_at) FROM stdin;
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6ImEwYzFkNjZiLTYyMTUtNDA1Zi05YTUyLTVlODBmYWUwYTUzOCIsImlhdCI6MTc3Mjg5MzAyOCwiZXhwIjoxNzcyODkzOTI4fQ.BHgVTGFq4CtxCUAMkShhnFsKUXBGVh9LZGjlMQ9g3CU	2026-03-07 20:02:08	2026-03-07 19:47:40.101056
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6IjgyYjFjNTUyLTE2YWMtNDBlNy1iOWZmLTlmMjAxNmMzNDUyZiIsImlhdCI6MTc3Mjg5MzA2MiwiZXhwIjoxNzcyODkzOTYyfQ.oFywRVkEADjsmjiDy0UUrOV5uCnYNZm2S5EdSe-yUSI	2026-03-07 20:02:42	2026-03-07 19:53:17.583467
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6IjBlMDM4YmQzLTZkMmQtNDk3Ni04NGI3LTBkN2Y2ZmQwNzU4YyIsImlhdCI6MTc3Mjg5MzQwMiwiZXhwIjoxNzcyODk0MzAyfQ.U_swsXqlL77r-00QyZylPetL7QtbPEzsucbIfvomTWo	2026-03-07 20:08:22	2026-03-07 19:53:31.704135
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6ImVkOGM1ZDE0LWU1YjktNDA2YS04OTViLWVlMTM1Y2ZmNDI4NSIsImlhdCI6MTc3Mjg5MzQxNSwiZXhwIjoxNzcyODk0MzE1fQ.mAo0tgsokRVb3KXLS5d1TweSNsZIRxIgRDPLYtqMWhY	2026-03-07 20:08:35	2026-03-07 19:55:34.130584
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6IjkzZDNiN2NlLWFlMTgtNDRjNy1hYmFkLTA2YWNmNzE0NjZhYyIsImlhdCI6MTc3Mjg5MzU3MywiZXhwIjoxNzcyODk0NDczfQ.ICeP9fe_HrAXg1aKalcHgsTmBBIfPapsiD3_D2rDEgU	2026-03-07 20:11:13	2026-03-07 19:56:17.868389
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6ImNiNzZmN2MzLTIyNmYtNGJhMi1hZGM3LTI4MjI4ZmFkMjk1OCIsImlhdCI6MTc3Mjg5Mzc5OSwiZXhwIjoxNzcyODk0Njk5fQ.DrXbHXD7FMTgWnOOLn_WssnNRtitatAoqGUEuGk4IPc	2026-03-07 20:14:59	2026-03-07 20:00:04.452936
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6ImFlMzY3ZmVhLTA5ZTktNGQwYy1iNDMyLWM1NmMyZWI4MDMwNCIsImlhdCI6MTc3Mjg5MzgzNiwiZXhwIjoxNzcyODk0NzM2fQ.KN-g_izzoR7FSub2iuolg2VFbg0rapruOqRcQaRrfUA	2026-03-07 20:15:36	2026-03-07 20:01:34.171009
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6IjE1ZmMxYmExLTU1OGYtNGI1NS1iMWI1LTRlYzg3OTdmMmRmMiIsImlhdCI6MTc3Mjg5Mzg5OSwiZXhwIjoxNzcyODk0Nzk5fQ._PQmh7ZVZYtR6fX1lyopItrXXEk3kekQ9VF9bSvQ8vg	2026-03-07 20:16:39	2026-03-07 20:02:13.63238
\.


--
-- TOC entry 3126 (class 0 OID 672904)
-- Dependencies: 201
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, avatar_url, bio, created_at, updated_at) FROM stdin;
6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	Admin User	admin@vsdox.com	$2a$12$xb.8ESQCBWoXyiqAwb8VBe6H.T.07b1c3FVaSLUrf7htp7wdBUQJq	admin	\N	\N	2026-03-07 19:01:55.01005	2026-03-07 19:01:55.01005
\.


--
-- TOC entry 2965 (class 2606 OID 672959)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2967 (class 2606 OID 672961)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 2986 (class 2606 OID 673050)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- TOC entry 2980 (class 2606 OID 672995)
-- Name: post_categories post_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_pkey PRIMARY KEY (post_id, category_id);


--
-- TOC entry 2984 (class 2606 OID 673030)
-- Name: post_revisions post_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_pkey PRIMARY KEY (id);


--
-- TOC entry 2982 (class 2606 OID 673010)
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id);


--
-- TOC entry 2976 (class 2606 OID 672983)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 2978 (class 2606 OID 672985)
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- TOC entry 2961 (class 2606 OID 672939)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 2963 (class 2606 OID 672941)
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- TOC entry 2969 (class 2606 OID 672967)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2971 (class 2606 OID 672969)
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- TOC entry 2956 (class 2606 OID 672926)
-- Name: token_blacklist token_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_blacklist
    ADD CONSTRAINT token_blacklist_pkey PRIMARY KEY (token);


--
-- TOC entry 2951 (class 2606 OID 672917)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2953 (class 2606 OID 672915)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2972 (class 1259 OID 673058)
-- Name: idx_posts_published_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_published_at ON public.posts USING btree (published_at DESC);


--
-- TOC entry 2973 (class 1259 OID 673056)
-- Name: idx_posts_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_slug ON public.posts USING btree (slug);


--
-- TOC entry 2974 (class 1259 OID 673057)
-- Name: idx_posts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_status ON public.posts USING btree (status);


--
-- TOC entry 2957 (class 1259 OID 672949)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires_at);


--
-- TOC entry 2958 (class 1259 OID 672948)
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_token ON public.sessions USING btree (session_token);


--
-- TOC entry 2959 (class 1259 OID 672947)
-- Name: idx_sessions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_user ON public.sessions USING btree (user_id);


--
-- TOC entry 2954 (class 1259 OID 672927)
-- Name: idx_token_blacklist_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_token_blacklist_expires ON public.token_blacklist USING btree (expires_at);


--
-- TOC entry 2995 (class 2606 OID 673051)
-- Name: media media_uploader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.users(id);


--
-- TOC entry 2990 (class 2606 OID 673001)
-- Name: post_categories post_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 2989 (class 2606 OID 672996)
-- Name: post_categories post_categories_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 2994 (class 2606 OID 673036)
-- Name: post_revisions post_revisions_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 2993 (class 2606 OID 673031)
-- Name: post_revisions post_revisions_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 2991 (class 2606 OID 673011)
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 2992 (class 2606 OID 673016)
-- Name: post_tags post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 2988 (class 2606 OID 672986)
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 2987 (class 2606 OID 672942)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-03-07 20:05:01

--
-- PostgreSQL database dump complete
--


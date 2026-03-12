--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

-- Started on 2026-03-11 15:08:00

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
-- TOC entry 3154 (class 0 OID 0)
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
-- TOC entry 211 (class 1259 OID 673059)
-- Name: password_reset_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.password_reset_requests OWNER TO postgres;

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
-- TOC entry 3141 (class 0 OID 672950)
-- Dependencies: 204
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, created_at) FROM stdin;
d00919e8-ad95-4f65-9920-fe1c265da9a1	Business Strategy	business-strategy	\N	2026-03-07 19:04:13.259243
6f5d6846-126c-408d-b392-e10aad23e707	Technology	technology	\N	2026-03-07 19:17:20.780756
66b52069-ad88-46c0-9148-0f56d63f89b9	Public Sector	public-sector	\N	2026-03-07 19:18:02.42623
e72b3abd-e78a-44e5-8946-e405fc446519	Test	test	\N	2026-03-09 18:28:35.686804
\.


--
-- TOC entry 3147 (class 0 OID 673041)
-- Dependencies: 210
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, filename, original_name, url, public_id, file_type, size, alt_text, uploader_id, uploaded_at) FROM stdin;
1456d8fb-23a3-4d4a-811d-2ccdf7fbf701	1773066198710-vqfjswvu.png	Airtel_DC_DR_FD.png	http://localhost:5000/uploads/1773066198710-vqfjswvu.png	1773066198710-vqfjswvu.png	image/png	1844601	\N	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-09 19:53:18.831099
\.


--
-- TOC entry 3148 (class 0 OID 673059)
-- Dependencies: 211
-- Data for Name: password_reset_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_requests (id, user_id, token_hash, expires_at, used, created_at) FROM stdin;
92790f31-9b7a-40f7-b68a-a1162fc5a549	d7369266-9034-4683-9a69-d284bcd0ea0e	b2dcf3e608e1f2addb9f4fedc5389eb2d6d078e833e4201517bd53fcc7ca7329	2026-03-10 17:51:53.563	t	2026-03-10 16:51:53.564618
0c3c98ce-4027-45fe-9490-2728d19ca5cb	d7369266-9034-4683-9a69-d284bcd0ea0e	545440c3cec42b74e8757adb27969476f6df36da4c88e693c0655865d61284aa	2026-03-10 18:07:13.661	t	2026-03-10 17:07:13.662391
43e53178-13ab-480d-8a2a-1f834b4eaab6	d7369266-9034-4683-9a69-d284bcd0ea0e	47eee610520d16823291f3a2fd0232a1cd3ecd9fa0e06c2e3c67da90cd3b8414	2026-03-10 18:13:13.918	t	2026-03-10 17:13:13.919152
\.


--
-- TOC entry 3144 (class 0 OID 672991)
-- Dependencies: 207
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_categories (post_id, category_id) FROM stdin;
98404c40-65fa-4ff7-8504-d7ed72b36036	d00919e8-ad95-4f65-9920-fe1c265da9a1
c3b18e7b-7c3d-47be-82d2-2206ce520ba9	66b52069-ad88-46c0-9148-0f56d63f89b9
6dc869ef-77b0-4425-b9fc-97a4f2fee668	6f5d6846-126c-408d-b392-e10aad23e707
79cc045e-faaa-4799-8812-07528860ba31	e72b3abd-e78a-44e5-8946-e405fc446519
65abc25f-74a6-4345-a346-99868b8d40da	6f5d6846-126c-408d-b392-e10aad23e707
65abc25f-74a6-4345-a346-99868b8d40da	d00919e8-ad95-4f65-9920-fe1c265da9a1
65abc25f-74a6-4345-a346-99868b8d40da	e72b3abd-e78a-44e5-8946-e405fc446519
\.


--
-- TOC entry 3146 (class 0 OID 673021)
-- Dependencies: 209
-- Data for Name: post_revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_revisions (id, post_id, title, body, author_id, created_at) FROM stdin;
84c27b2d-963e-4b5e-a63f-a56ac61a6490	98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:07:17.761937
c35b8c59-7e23-4e06-b400-1adf943a4808	98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.\n![Screenshot 2026-02-21 195226.png](http://localhost:5000/uploads/1772890614176-s8voerdt.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:08:26.978788
a49c5405-cb03-4e05-8bef-3ef82b8619c1	6dc869ef-77b0-4425-b9fc-97a4f2fee668	The Role of AI in Automated Document Classification	Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-07 19:19:13.9718
738d961b-0b47-4fc7-97c3-b3db8b1c54a2	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	Test the post 	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 13:16:17.326241
de8cd662-d288-42ae-aa34-40f15f613f19	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 13:24:11.540469
d14aa3ab-8c84-456f-bedb-946cec50f0a0	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 13:24:50.691108
f578adbd-74e3-4f65-a6f1-413e2ce8a38b	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 13:49:42.413809
56c8b81a-f9c0-406d-b445-b5bf8a813a8d	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:12:00.766178
e1680a81-2e5c-433c-a9db-a92e7a59a1f9	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:12:38.177517
31b7f217-0973-47a4-80be-9194d71e8326	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:13:19.846489
ce36b661-1e18-4d7d-98bd-fd3f43041a17	79cc045e-faaa-4799-8812-07528860ba31	Test Draft	**Test Draft**	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:26:36.977314
b28c82e1-ff51-435c-8c4c-8da57a54b945	79cc045e-faaa-4799-8812-07528860ba31	Test Draft	**Test Draft**	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:27:37.025889
7b241c7f-c55e-4424-b0ea-27a63286a20c	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:33:46.975976
cdc56648-4a7b-4c7b-9a2d-2c3fe9f2c6c6	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:35:52.280336
a80e8298-bc58-4a0f-845d-1e09475903a3	65abc25f-74a6-4345-a346-99868b8d40da	Test Post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	2026-03-10 14:41:49.027616
\.


--
-- TOC entry 3145 (class 0 OID 673006)
-- Dependencies: 208
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_tags (post_id, tag_id) FROM stdin;
\.


--
-- TOC entry 3143 (class 0 OID 672970)
-- Dependencies: 206
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, slug, body, body_html, excerpt, status, author_id, featured_image, featured_image_alt, meta_title, meta_description, views, reading_time, published_at, scheduled_at, created_at, updated_at, deleted_at) FROM stdin;
6dc869ef-77b0-4425-b9fc-97a4f2fee668	The Role of AI in Automated Document Classification	the-role-of-ai-in-automated-document-classification	Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.	<p>Explore how Large Language Models and OCR are revolutionizing the way we categorize and extract data from millions of records.</p>\n	The Role of AI in Automated Document Classification	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop				33	1	2026-03-07 19:17:46.097	\N	2026-03-07 19:17:46.099547	2026-03-07 19:19:13.975315	\N
98404c40-65fa-4ff7-8504-d7ed72b36036	Unlocking ROI with Enterprise Content Management (ECM)	unlocking-roi-with-enterprise-content-management-ecm	Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.\n	<p>Discover how modern ECM systems go beyond storage to drive operational efficiency and measurable cost savings for enterprises.</p>\n	Unlocking ROI with Enterprise Content Management (ECM)	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&amp;w=2426&amp;auto=format&amp;fit=crop				26	1	2026-03-07 19:08:40.470819	\N	2026-03-07 19:04:17.057562	2026-03-07 19:08:40.470819	\N
65abc25f-74a6-4345-a346-99868b8d40da	Test Post	test-post	**Test Post**\n![image](http://localhost:5000/uploads/1773066198710-vqfjswvu.png)\n	<p><strong>Test Post</strong>\n<img src="http://localhost:5000/uploads/1773066198710-vqfjswvu.png" alt="image"></p>\n	Test Post	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	http://localhost:5000/uploads/1773132946369-rb8zojgt.jpg	\N	\N	\N	20	1	2026-03-10 12:45:15.084	\N	2026-03-10 12:44:27.27329	2026-03-10 15:59:10.921961	2026-03-10 15:59:10.921961
c3b18e7b-7c3d-47be-82d2-2206ce520ba9	Transitioning to Paperless: A Roadmap for Government Bodies	transitioning-to-paperless-a-roadmap-for-government-bodies	A step-by-step guide for public sector organizations to migrate delicate historical archives into secure digital repositories.	<p>A step-by-step guide for public sector organizations to migrate delicate historical archives into secure digital repositories.</p>\n	Transitioning to Paperless: A Roadmap for Government Bodies	published	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2340&auto=format&fit=crop				70	1	2026-03-07 19:18:49.891	\N	2026-03-07 19:18:49.891912	2026-03-07 19:18:49.891912	\N
79cc045e-faaa-4799-8812-07528860ba31	Test Draft	test-draft	**Test Draft**	<p><strong>Test Draft</strong></p>\n	Test Draft	draft	6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5		\N	\N	\N	0	1	2026-03-10 14:26:04.143	\N	2026-03-10 14:26:04.107662	2026-03-10 14:27:50.674626	2026-03-10 14:27:50.674626
\.


--
-- TOC entry 3140 (class 0 OID 672928)
-- Dependencies: 203
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, session_token, last_active, idle_timeout, expires_at, created_at, user_agent, ip_address) FROM stdin;
\.


--
-- TOC entry 3142 (class 0 OID 672962)
-- Dependencies: 205
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, slug) FROM stdin;
361282f9-c4d0-464a-b870-cca63f3e27e3	ABC	abc
\.


--
-- TOC entry 3139 (class 0 OID 672918)
-- Dependencies: 202
-- Data for Name: token_blacklist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token_blacklist (token, expires_at, created_at) FROM stdin;
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiYTVkZGJmLTE5ZDgtNGM0Yy1hZWU3LWViOWE2MDlkY2JiNSIsInNpZCI6ImQxYWQxOThmLTk2MjYtNGRmOC05N2Y4LTU1MmIyNmM0N2JiNiIsImlhdCI6MTc3MzIyMTc2MCwiZXhwIjoxNzczMjIyNjYwfQ.xeuCPsM8cxN5l4ioyY4a7L9r4NtLOVXZZ6zb8hc12OE	2026-03-11 15:21:00	2026-03-11 15:06:37.276411
\.


--
-- TOC entry 3138 (class 0 OID 672904)
-- Dependencies: 201
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, avatar_url, bio, created_at, updated_at) FROM stdin;
6ba5ddbf-19d8-4c4c-aee7-eb9a609dcbb5	Admin User	admin@vsdox.com	$2a$12$xb.8ESQCBWoXyiqAwb8VBe6H.T.07b1c3FVaSLUrf7htp7wdBUQJq	admin	\N	\N	2026-03-07 19:01:55.01005	2026-03-07 19:01:55.01005
d7369266-9034-4683-9a69-d284bcd0ea0e	Pitbaran	pitbarank@virsoftech.com	$2a$12$SyD9T1ntDGLZV4X6PMXthu4K..jIFMeja0F6L1Y5.E8w4l3.2wGYG	admin	\N	\N	2026-03-10 16:39:37.022362	2026-03-10 17:14:39.886323
\.


--
-- TOC entry 2973 (class 2606 OID 672959)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2975 (class 2606 OID 672961)
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- TOC entry 2994 (class 2606 OID 673050)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- TOC entry 2997 (class 2606 OID 673069)
-- Name: password_reset_requests password_reset_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_requests
    ADD CONSTRAINT password_reset_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 2988 (class 2606 OID 672995)
-- Name: post_categories post_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_pkey PRIMARY KEY (post_id, category_id);


--
-- TOC entry 2992 (class 2606 OID 673030)
-- Name: post_revisions post_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_pkey PRIMARY KEY (id);


--
-- TOC entry 2990 (class 2606 OID 673010)
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id);


--
-- TOC entry 2984 (class 2606 OID 672983)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 2986 (class 2606 OID 672985)
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- TOC entry 2969 (class 2606 OID 672939)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 2971 (class 2606 OID 672941)
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- TOC entry 2977 (class 2606 OID 672967)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2979 (class 2606 OID 672969)
-- Name: tags tags_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);


--
-- TOC entry 2964 (class 2606 OID 672926)
-- Name: token_blacklist token_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_blacklist
    ADD CONSTRAINT token_blacklist_pkey PRIMARY KEY (token);


--
-- TOC entry 2959 (class 2606 OID 672917)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2961 (class 2606 OID 672915)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2995 (class 1259 OID 673075)
-- Name: idx_password_reset_requests_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_requests_user ON public.password_reset_requests USING btree (user_id);


--
-- TOC entry 2980 (class 1259 OID 673058)
-- Name: idx_posts_published_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_published_at ON public.posts USING btree (published_at DESC);


--
-- TOC entry 2981 (class 1259 OID 673056)
-- Name: idx_posts_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_slug ON public.posts USING btree (slug);


--
-- TOC entry 2982 (class 1259 OID 673057)
-- Name: idx_posts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_status ON public.posts USING btree (status);


--
-- TOC entry 2965 (class 1259 OID 672949)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires_at);


--
-- TOC entry 2966 (class 1259 OID 672948)
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_token ON public.sessions USING btree (session_token);


--
-- TOC entry 2967 (class 1259 OID 672947)
-- Name: idx_sessions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_user ON public.sessions USING btree (user_id);


--
-- TOC entry 2962 (class 1259 OID 672927)
-- Name: idx_token_blacklist_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_token_blacklist_expires ON public.token_blacklist USING btree (expires_at);


--
-- TOC entry 3006 (class 2606 OID 673051)
-- Name: media media_uploader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.users(id);


--
-- TOC entry 3007 (class 2606 OID 673070)
-- Name: password_reset_requests password_reset_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_requests
    ADD CONSTRAINT password_reset_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3001 (class 2606 OID 673001)
-- Name: post_categories post_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3000 (class 2606 OID 672996)
-- Name: post_categories post_categories_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 3005 (class 2606 OID 673036)
-- Name: post_revisions post_revisions_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3004 (class 2606 OID 673031)
-- Name: post_revisions post_revisions_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_revisions
    ADD CONSTRAINT post_revisions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 3002 (class 2606 OID 673011)
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 3003 (class 2606 OID 673016)
-- Name: post_tags post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 2999 (class 2606 OID 672986)
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 2998 (class 2606 OID 672942)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-03-11 15:08:01

--
-- PostgreSQL database dump complete
--


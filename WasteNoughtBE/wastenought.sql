--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Postgres.app)
-- Dumped by pg_dump version 16.4 (Postgres.app)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: benjaminblackwellolmstead
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO benjaminblackwellolmstead;

--
-- Name: temperature_readings; Type: TABLE; Schema: public; Owner: benjaminblackwellolmstead
--

CREATE TABLE public.temperature_readings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    temperature double precision NOT NULL
);


ALTER TABLE public.temperature_readings OWNER TO benjaminblackwellolmstead;

--
-- Name: temperature_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: benjaminblackwellolmstead
--

CREATE SEQUENCE public.temperature_readings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.temperature_readings_id_seq OWNER TO benjaminblackwellolmstead;

--
-- Name: temperature_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER SEQUENCE public.temperature_readings_id_seq OWNED BY public.temperature_readings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: benjaminblackwellolmstead
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    security_question text NOT NULL,
    security_answer text NOT NULL
);


ALTER TABLE public.users OWNER TO benjaminblackwellolmstead;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: benjaminblackwellolmstead
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO benjaminblackwellolmstead;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: temperature_readings id; Type: DEFAULT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.temperature_readings ALTER COLUMN id SET DEFAULT nextval('public.temperature_readings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: benjaminblackwellolmstead
--

COPY public.alembic_version (version_num) FROM stdin;
\.


--
-- Data for Name: temperature_readings; Type: TABLE DATA; Schema: public; Owner: benjaminblackwellolmstead
--

COPY public.temperature_readings (id, user_id, "timestamp", temperature) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: benjaminblackwellolmstead
--

COPY public.users (id, email, username, password, security_question, security_answer) FROM stdin;
1	test@example.com	testuser	$2b$12$CyEsLgwmgNDi/CTaL279suexYgK0TJr2mRKrqWVL8lo.Hrnttu2qa	Your first pet?	$2b$12$pulnZRLb17XIdf0zgkIZkuzmTSew3ahcQuLkjKgj184Al.AilDnLO
2	test1@example.com	testuser1	$2b$12$m8xIzmNhqWvZx6QK/tZCP.pz9V4C5r0bg2r9eegZ3CUa452CO0VL2	Your first pet?	$2b$12$Die3QKaOc1etfgdAspNovOu/QvRpM0hUeHlbybXskARw3gVzUv07G
3	test2@example.com	testuser2	$2b$12$Uk2SOiDo2kxYxWzViMObOeu7LWTuwqJgPk.xdGdOyvjs7YUfmLTHi	Your first pet?	$2b$12$eGqbP1OqDxzh5tJxsGiH5uGawsPfiFAZRGfexx6a9VJ2hZ0c4PJl.
4	test3@example.com	testuser3	$2b$12$2UkmJ4ZmuikeviBouSs57exbr8otx/B9W32acYIhjJsdgR4U52oky	Your first pet?	$2b$12$l/DAYrG8hJ4Xy7sIcg3rxech5b6X9B9iYBSD6olJenRaX20C.yzuu
\.


--
-- Name: temperature_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: benjaminblackwellolmstead
--

SELECT pg_catalog.setval('public.temperature_readings_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: benjaminblackwellolmstead
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: temperature_readings temperature_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.temperature_readings
    ADD CONSTRAINT temperature_readings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: temperature_readings temperature_readings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: benjaminblackwellolmstead
--

ALTER TABLE ONLY public.temperature_readings
    ADD CONSTRAINT temperature_readings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


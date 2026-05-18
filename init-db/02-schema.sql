--
-- PostgreSQL database dump
--

\restrict QZ3m4fWWZK2TtkeBuhk3xR8KWeDc4c8rr2LfRmoEZAIFx5kL8k4dDaFblqP4lXf

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    document_type character varying(20),
    document character varying(20) NOT NULL,
    name character varying(50) NOT NULL,
    address character varying(50),
    phone character varying(13),
    email character varying(50),
    module character varying(5),
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: incentive_rules; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.incentive_rules (
    id integer NOT NULL,
    efficiency_point integer NOT NULL,
    value numeric(10,2) NOT NULL
);


ALTER TABLE public.incentive_rules OWNER TO james;

--
-- Name: incentive_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.incentive_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incentive_rules_id_seq OWNER TO james;

--
-- Name: incentive_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.incentive_rules_id_seq OWNED BY public.incentive_rules.id;


--
-- Name: liquidation_details; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.liquidation_details (
    id integer NOT NULL,
    liquidation_id integer NOT NULL,
    employee_id integer NOT NULL,
    module character varying(10) NOT NULL,
    work_date date NOT NULL,
    worked_minutes integer NOT NULL,
    downtime_minutes integer NOT NULL,
    produced_minutes numeric(10,2),
    efficiency numeric(10,2) NOT NULL,
    incentive_base numeric(10,2) NOT NULL,
    payment numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.liquidation_details OWNER TO james;

--
-- Name: liquidation_details_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.liquidation_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidation_details_id_seq OWNER TO james;

--
-- Name: liquidation_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.liquidation_details_id_seq OWNED BY public.liquidation_details.id;


--
-- Name: liquidations; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.liquidations (
    id integer NOT NULL,
    module character varying(10) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_user character varying(40) NOT NULL
);


ALTER TABLE public.liquidations OWNER TO james;

--
-- Name: liquidations_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.liquidations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.liquidations_id_seq OWNER TO james;

--
-- Name: liquidations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.liquidations_id_seq OWNED BY public.liquidations.id;


--
-- Name: product_references; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_references (
    id integer NOT NULL,
    reference character varying(50) CONSTRAINT product_references_refrence_not_null NOT NULL,
    color character varying(30) NOT NULL,
    size character varying(10) NOT NULL,
    standard_time numeric(10,2) CONSTRAINT product_references_standar_time_not_null NOT NULL,
    active boolean DEFAULT true CONSTRAINT product_references_acvtive_not_null NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description character varying(100)
);


ALTER TABLE public.product_references OWNER TO postgres;

--
-- Name: product_references_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_references_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_references_id_seq OWNER TO postgres;

--
-- Name: product_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_references_id_seq OWNED BY public.product_references.id;


--
-- Name: production_orders; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.production_orders (
    id integer NOT NULL,
    reference_id integer NOT NULL,
    quantity integer NOT NULL,
    module character varying(10) NOT NULL,
    status character varying(20) DEFAULT 'ABIERTA'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quantity_pending integer DEFAULT 0
);


ALTER TABLE public.production_orders OWNER TO james;

--
-- Name: production_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.production_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.production_orders_id_seq OWNER TO james;

--
-- Name: production_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.production_orders_id_seq OWNED BY public.production_orders.id;


--
-- Name: production_records; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.production_records (
    id integer NOT NULL,
    order_id integer NOT NULL,
    reference_id integer NOT NULL,
    module character varying(10) NOT NULL,
    units integer NOT NULL,
    standard_time numeric(10,2) NOT NULL,
    total_time numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.production_records OWNER TO james;

--
-- Name: production_records_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.production_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.production_records_id_seq OWNER TO james;

--
-- Name: production_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.production_records_id_seq OWNED BY public.production_records.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) CONSTRAINT users_rol_not_null NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_logs; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.work_logs (
    id integer NOT NULL,
    module character varying NOT NULL,
    work_date date NOT NULL,
    minutes_worked integer NOT NULL,
    minutes_downtime integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    employee_id integer NOT NULL,
    CONSTRAINT chk_downtime_valid CHECK ((minutes_downtime <= minutes_worked))
);


ALTER TABLE public.work_logs OWNER TO james;

--
-- Name: work_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.work_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_logs_id_seq OWNER TO james;

--
-- Name: work_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.work_logs_id_seq OWNED BY public.work_logs.id;


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: incentive_rules id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.incentive_rules ALTER COLUMN id SET DEFAULT nextval('public.incentive_rules_id_seq'::regclass);


--
-- Name: liquidation_details id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidation_details ALTER COLUMN id SET DEFAULT nextval('public.liquidation_details_id_seq'::regclass);


--
-- Name: liquidations id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidations ALTER COLUMN id SET DEFAULT nextval('public.liquidations_id_seq'::regclass);


--
-- Name: product_references id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_references ALTER COLUMN id SET DEFAULT nextval('public.product_references_id_seq'::regclass);


--
-- Name: production_orders id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_orders ALTER COLUMN id SET DEFAULT nextval('public.production_orders_id_seq'::regclass);


--
-- Name: production_records id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_records ALTER COLUMN id SET DEFAULT nextval('public.production_records_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_logs id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.work_logs ALTER COLUMN id SET DEFAULT nextval('public.work_logs_id_seq'::regclass);


--
-- Name: employees employees_document_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_document_key UNIQUE (document);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: incentive_rules incentive_rules_efficiency_point_key; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.incentive_rules
    ADD CONSTRAINT incentive_rules_efficiency_point_key UNIQUE (efficiency_point);


--
-- Name: incentive_rules incentive_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.incentive_rules
    ADD CONSTRAINT incentive_rules_pkey PRIMARY KEY (id);


--
-- Name: liquidation_details liquidation_details_employee_id_work_date_module_key; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_employee_id_work_date_module_key UNIQUE (employee_id, work_date, module);


--
-- Name: liquidation_details liquidation_details_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_pkey PRIMARY KEY (id);


--
-- Name: liquidations liquidations_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidations
    ADD CONSTRAINT liquidations_pkey PRIMARY KEY (id);


--
-- Name: product_references product_references_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_references
    ADD CONSTRAINT product_references_pkey PRIMARY KEY (id);


--
-- Name: production_orders production_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_pkey PRIMARY KEY (id);


--
-- Name: production_records production_records_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_records
    ADD CONSTRAINT production_records_pkey PRIMARY KEY (id);


--
-- Name: work_logs uq_employee_day; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.work_logs
    ADD CONSTRAINT uq_employee_day UNIQUE (employee_id, work_date);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_logs work_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.work_logs
    ADD CONSTRAINT work_logs_pkey PRIMARY KEY (id);


--
-- Name: work_logs fk_work_logs_employee; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.work_logs
    ADD CONSTRAINT fk_work_logs_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: liquidation_details liquidation_details_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: liquidation_details liquidation_details_liquidation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.liquidation_details
    ADD CONSTRAINT liquidation_details_liquidation_id_fkey FOREIGN KEY (liquidation_id) REFERENCES public.liquidations(id);


--
-- Name: production_orders production_orders_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.product_references(id);


--
-- Name: production_records production_records_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_records
    ADD CONSTRAINT production_records_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.production_orders(id);


--
-- Name: production_records production_records_reference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.production_records
    ADD CONSTRAINT production_records_reference_id_fkey FOREIGN KEY (reference_id) REFERENCES public.product_references(id);


--
-- PostgreSQL database dump complete
--

\unrestrict QZ3m4fWWZK2TtkeBuhk3xR8KWeDc4c8rr2LfRmoEZAIFx5kL8k4dDaFblqP4lXf


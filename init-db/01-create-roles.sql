-- Create required roles before loading schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'james') THEN
    CREATE ROLE james WITH LOGIN;
  END IF;
END
$$;

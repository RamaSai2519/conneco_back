-- Create users table
CREATE TABLE public.users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    pass TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything
CREATE POLICY "Service role can do everything" ON public.users
FOR ALL USING (auth.role() = 'service_role');

-- Create a policy for authenticated users to read their own data
CREATE POLICY "Users can read own data" ON public.users
FOR SELECT USING (auth.uid()::text = id::text);

-- Create posts table
CREATE TABLE public.posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT at_least_one_content CHECK (
        (text IS NOT NULL AND text != '') OR 
        (image_url IS NOT NULL AND image_url != '')
    )
);

-- Create index for faster queries by user_id
CREATE INDEX idx_posts_user_id ON public.posts(user_id);

-- Create index for faster queries by created_at
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything
CREATE POLICY "Service role can do everything" ON public.posts
FOR ALL USING (auth.role() = 'service_role');

-- Create a policy for users to read their own posts
CREATE POLICY "Users can read own posts" ON public.posts
FOR SELECT USING (auth.uid()::text = user_id::text);
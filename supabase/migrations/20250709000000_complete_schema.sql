-- ==========================================
-- USERS TABLE
-- ==========================================

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

-- ==========================================
-- POSTS TABLE
-- ==========================================

-- Create posts table with complete structure
CREATE TABLE public.posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text',
    content TEXT,
    image_url TEXT,
    caption TEXT,
    date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Content constraint: at least one of content or image_url must be present
    CONSTRAINT at_least_one_content CHECK (
        (content IS NOT NULL AND content != '') OR 
        (image_url IS NOT NULL AND image_url != '')
    ),
    
    -- Type constraint: must be one of the valid post types
    CONSTRAINT valid_post_type CHECK (
        type IN ('text', 'image', 'mixed')
    )
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Create indexes for faster queries
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_date ON public.posts(date DESC);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_user_name ON public.posts(user_name);

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything
CREATE POLICY "Service role can do everything" ON public.posts
FOR ALL USING (auth.role() = 'service_role');

-- Create a policy for users to read their own posts
CREATE POLICY "Users can read own posts" ON public.posts
FOR SELECT USING (auth.uid()::text = user_id::text);

-- ==========================================
-- COLUMN COMMENTS
-- ==========================================

-- Add comments to describe the columns
COMMENT ON COLUMN public.posts.type IS 'Type of post: text, image, or mixed';
COMMENT ON COLUMN public.posts.content IS 'Text content of the post';
COMMENT ON COLUMN public.posts.caption IS 'Caption for image posts or additional description';
COMMENT ON COLUMN public.posts.user_name IS 'Cached user name for faster queries';
COMMENT ON COLUMN public.posts.date IS 'User-specified date for the post content (from frontend)';

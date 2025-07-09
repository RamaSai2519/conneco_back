-- Add date column to posts table
ALTER TABLE public.posts ADD COLUMN date TIMESTAMPTZ;

-- Create index for faster queries by date
CREATE INDEX idx_posts_date ON public.posts(date DESC);

-- Add comment to describe the column
COMMENT ON COLUMN public.posts.date IS 'User-specified date for the post content (from frontend)';

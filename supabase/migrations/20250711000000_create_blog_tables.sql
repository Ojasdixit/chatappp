-- Create blog_categories table with SEO fields
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table with enhanced SEO fields
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Enhanced SEO fields
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    seo_canonical_url TEXT,
    seo_meta_robots VARCHAR(50) DEFAULT 'index, follow',
    seo_og_title VARCHAR(255),
    seo_og_description TEXT,
    seo_og_image TEXT,
    seo_twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    seo_twitter_title VARCHAR(255),
    seo_twitter_description TEXT,
    seo_twitter_image TEXT,
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    average_read_time INTEGER, -- in minutes
    
    -- Content relationships
    related_posts UUID[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table with SEO fields
CREATE TABLE IF NOT EXISTS public.blog_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_post_tags junction table with additional metadata
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    relevance_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- Create blog_comments table with enhanced fields
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website TEXT,
    author_ip INET,
    user_agent TEXT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_spam BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tracking popular searches
CREATE TABLE IF NOT EXISTS public.blog_search_terms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    search_count INTEGER DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tracking post views by day
CREATE TABLE IF NOT EXISTS public.blog_post_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    view_date DATE NOT NULL,
    view_count INTEGER DEFAULT 1,
    UNIQUE(post_id, view_date)
);

-- Create function to update view count
CREATE OR REPLACE FUNCTION public.increment_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.blog_post_views (post_id, view_date, view_count)
    SELECT id, CURRENT_DATE, 1
    FROM public.blog_posts
    WHERE slug = post_slug
    ON CONFLICT (post_id, view_date) 
    DO UPDATE SET view_count = blog_post_views.view_count + 1;
    
    UPDATE public.blog_posts
    SET view_count = view_count + 1
    WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;

-- Create function for full-text search
CREATE OR REPLACE FUNCTION public.search_blog_posts(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category_name TEXT,
    category_slug TEXT,
    search_rank FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.published_at,
        c.name as category_name,
        c.slug as category_slug,
        ts_rank(
            setweight(to_tsvector('english', p.title), 'A') ||
            setweight(to_tsvector('english', p.excerpt), 'B') ||
            setweight(to_tsvector('english', p.content), 'C'),
            plainto_tsquery('english', search_term)
        ) as search_rank
    FROM 
        public.blog_posts p
    JOIN 
        public.blog_categories c ON p.category_id = c.id
    WHERE 
        p.is_published = true AND
        (
            to_tsvector('english', p.title) @@ plainto_tsquery('english', search_term) OR
            to_tsvector('english', p.excerpt) @@ plainto_tsquery('english', search_term) OR
            to_tsvector('english', p.content) @@ plainto_tsquery('english', search_term)
        )
    ORDER BY 
        search_rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for blog_categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Enable read access for all users" 
ON public.blog_categories 
FOR SELECT 
USING (true);

-- Create RLS policies for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Enable read access for published posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- Allow authenticated users to create posts
CREATE POLICY "Enable insert for authenticated users" 
ON public.blog_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update their own posts
CREATE POLICY "Enable update for post authors" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at) WHERE is_published = true;
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_post_tags_post ON public.blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag ON public.blog_post_tags(tag_id);

-- Add some default categories
INSERT INTO public.blog_categories (name, slug, description)
VALUES 
  ('Viral Videos', 'viral-videos', 'Latest trending viral videos from India'),
  ('MMS Leaks', 'mms-leaks', 'Latest MMS leaks and scandals'),
  ('Viral News', 'viral-news', 'Trending news stories from India'),
  ('Dating Tips', 'dating-tips', 'Tips and advice for online dating'),
  ('App Guides', 'app-guides', 'Guides for using chat and dating apps'),
  ('Safety Tips', 'safety-tips', 'Online safety and privacy tips')
ON CONFLICT (slug) DO NOTHING;

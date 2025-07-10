import { supabase } from "@/integrations/supabase/client";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  is_featured: boolean;
  display_order: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category_id: string | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  published_at: string | null;
  author_id: string | null;
  view_count: number;
  share_count: number;
  average_read_time: number | null;
  related_posts?: BlogPost[];
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  seo_canonical_url?: string | null;
  seo_meta_robots?: string;
  seo_og_title?: string | null;
  seo_og_description?: string | null;
  seo_og_image?: string | null;
  seo_twitter_card?: string;
  seo_twitter_title?: string | null;
  seo_twitter_description?: string | null;
  seo_twitter_image?: string | null;
  created_at: string;
  updated_at: string;
}

// Categories
export const getCategories = async (): Promise<BlogCategory[]> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as BlogCategory[];
};

export const getCategoryBySlug = async (slug: string): Promise<BlogCategory | null> => {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }
  return data as BlogCategory;
};

// Tags
export const getTags = async (): Promise<BlogTag[]> => {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
  return data as BlogTag[];
};

// Posts
export const getFeaturedPosts = async (limit: number = 3): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories!inner(*)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
  return data as unknown as BlogPost[];
};

export const getTrendingPosts = async (limit: number = 5): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      blog_categories!inner(*)
    `)
    .eq('is_published', true)
    .eq('is_trending', true)
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
  return data as unknown as BlogPost[];
};

export const getPosts = async ({
  page = 1,
  limit = 10,
  categorySlug,
  tagSlug,
  searchQuery,
  featuredOnly = false,
  trendingOnly = false,
  sortBy = 'published_at',
  sortOrder = 'desc'
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<{ posts: BlogPost[]; total: number }> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('blog_posts')
    .select(
      `*,
      blog_categories!inner(*),
      blog_post_tags(
        blog_tags(*)
      )`,
      { count: 'exact' }
    )
    .eq('is_published', true);

  // Apply filters
  if (categorySlug) {
    query = query.eq('blog_categories.slug', categorySlug);
  }

  if (tagSlug) {
    query = query.contains('tags', [{ slug: tagSlug }]);
  }

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (trendingOnly) {
    query = query.eq('is_trending', true);
  }

  if (searchQuery) {
    query = query.textSearch('search_vector', searchQuery);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  
  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0 };
  }

  // Format the response
  const posts = (data || []).map((post: any) => ({
    ...post,
    category: post.blog_categories,
    tags: post.blog_post_tags?.map((pt: any) => pt.blog_tags) || []
  }));

  return {
    posts: posts as BlogPost[],
    total: count || 0
  };
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Increment view count
  await supabase.rpc('increment_post_views', { post_slug: slug });
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      `*,
      blog_categories!inner(*),
      blog_post_tags(
        blog_tags(*)
      )`
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  // Format the response
  const post = {
    ...data,
    category: data.blog_categories,
    tags: data.blog_post_tags?.map((pt: any) => pt.blog_tags) || []
  };

  // Remove the joined data
  delete (post as any).blog_categories;
  delete (post as any).blog_post_tags;

  return post as BlogPost;
};

// Search
export const searchPosts = async (query: string, limit: number = 5): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .rpc('search_blog_posts', { search_term: query })
    .limit(limit);

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }
  return data as BlogPost[];
};

// Track search terms
export const trackSearchTerm = async (term: string): Promise<void> => {
  if (!term.trim()) return;
  
  await supabase.rpc('increment_search_term', { search_term: term });
};

// Get related posts
export const getRelatedPosts = async (postId: string, limit: number = 3): Promise<BlogPost[]> => {
  // First get the current post to get its category and tags
  const { data: postData } = await supabase
    .from('blog_posts')
    .select('category_id, blog_post_tags(tag_id)')
    .eq('id', postId)
    .single();

  if (!postData) return [];

  const categoryId = postData.category_id;
  const tagIds = (postData as any).blog_post_tags?.map((pt: any) => pt.tag_id) || [];

  // Build a query to find related posts
  let query = supabase
    .from('blog_posts')
    .select('*')
    .neq('id', postId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  // If we have a category, prioritize posts in the same category
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // If we have tags, also include posts with matching tags
  if (tagIds.length > 0) {
    query = query.contains('tags', tagIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }

  return data as BlogPost[];
};

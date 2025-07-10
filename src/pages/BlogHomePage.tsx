import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { BlogNavigation } from '@/components/blog/BlogNavigation';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { FeaturedPosts } from '@/components/blog/FeaturedPosts';
import { CategorySection } from '@/components/blog/CategorySection';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPosts, getCategories, BlogPost, BlogCategory } from '@/services/blogService';
import { cn } from '@/lib/utils';

const POSTS_PER_PAGE = 9;

export default function BlogHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get query parameters
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const searchQuery = searchParams.get('search');
  
  // Fetch posts and categories
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Only show loading state if we don't have any posts yet
        if (!posts.length) {
          setPosts([]);
        }
        
        // Fetch posts with pagination and filters
        const { posts: fetchedPosts, total } = await getPosts({
          page: currentPage,
          limit: POSTS_PER_PAGE,
          categorySlug: categorySlug || undefined,
          tagSlug: tagSlug || undefined,
          searchQuery: searchQuery || undefined,
        });
        
        // Fetch categories for sidebar
        const fetchedCategories = await getCategories();
        
        if (isMounted) {
          setPosts(fetchedPosts || []);
          setCategories(fetchedCategories);
          setTotalPosts(total || 0);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
        if (isMounted) {
          setPosts([]);
          setTotalPosts(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [currentPage, categorySlug, tagSlug, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    navigate('/blog');
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(categorySlug || tagSlug || searchQuery);

  // Get active category name for the title
  const activeCategory = categorySlug 
    ? categories.find(c => c.slug === categorySlug)?.name 
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {activeCategory 
            ? activeCategory 
            : searchQuery 
              ? `Search Results for "${searchQuery}"`
              : tagSlug
                ? `#${tagSlug.replace(/-/g, ' ')}`
                : 'Latest Blog Posts'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {searchQuery 
            ? `Found ${totalPosts} ${totalPosts === 1 ? 'post' : 'posts'} matching your search`
            : 'Discover the latest news, tips, and stories about online chat and social connections.'}
        </p>
      </section>

      {/* Featured Posts - Only show on first page with no filters */}
      {currentPage === 1 && !hasActiveFilters && (
        <section className="mb-16">
          <FeaturedPosts />
        </section>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 space-y-8">
          <BlogSearch />
          <BlogNavigation categories={categories} loading={loading} />
          
          {/* Popular Tags */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-medium mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'omegle', 'chatroulette', 'random chat', 'video chat', 
                'stranger chat', 'online dating', 'make friends', 'anonymous chat'
              ].map((tag) => (
                <Button
                  key={tag}
                  variant={tagSlug === tag.toLowerCase().replace(/\s+/g, '-') ? 'default' : 'secondary'}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => navigate(`/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {activeCategory || tagSlug || searchQuery ? 'Filtered Posts' : 'Latest Posts'}
              </h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
            
            <Tabs 
              defaultValue="grid" 
              className="w-full sm:w-auto"
              onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
            >
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Blog Posts */}
          <BlogPostList
            posts={posts}
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            loading={loading}
            variant={viewMode}
          />
        </div>
      </div>

      {/* Category Section - Only show on first page with no filters */}
      {currentPage === 1 && !hasActiveFilters && (
        <section className="mt-24">
          <CategorySection categories={categories} loading={loading} />
        </section>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts, getCategories, BlogPost, BlogCategory } from '@/services/blogService';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 9;

  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch posts with filters
        const { posts: fetchedPosts, total } = await getPosts({
          page: currentPage,
          limit: postsPerPage,
          categorySlug: categorySlug || undefined,
          tagSlug: tagSlug || undefined,
          searchQuery: search || undefined,
        });
        
        // Fetch categories for sidebar
        const fetchedCategories = await getCategories();
        
        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
        setTotalPosts(total || 0);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, tagSlug, search, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    
    // Reset to first page on new search
    setCurrentPage(1);
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full md:w-3/4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {categorySlug 
                ? `Category: ${categories.find(c => c.slug === categorySlug)?.name || categorySlug}`
                : tagSlug
                  ? `Tag: ${tagSlug}`
                  : search
                    ? `Search Results for "${search}"`
                    : 'Latest Blog Posts'}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-gray-200 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full flex flex-col">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="block h-full group">
                    <Card className="h-full transition-all duration-300 flex flex-col border border-gray-100 hover:border-gray-200 hover:shadow-md">
                      {post.featured_image_url && (
                        <div className="relative pt-[56.25%] overflow-hidden rounded-t-lg">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          {post.category && (
                            <span className="text-primary font-medium">
                              {post.category.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="link" className="p-0">
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show first page, last page, and pages around current page
                    if (
                      i === 0 ||
                      i === totalPages - 1 ||
                      (i >= currentPage - 2 && i <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No posts found</h3>
              <p className="text-gray-500">
                {search
                  ? 'No posts match your search. Try a different term.'
                  : 'Check back soon for new content!'}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  window.history.pushState({}, '', '/blog');
                }}
              >
                View All Posts
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <Card className="sticky top-24 border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  to="/blog"
                  className={`block px-4 py-2 rounded-md hover:bg-accent ${
                    !categorySlug ? 'bg-accent font-medium' : ''
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blog?category=${category.slug}`}
                    className={`block px-4 py-2 rounded-md hover:bg-accent ${
                      categorySlug === category.slug ? 'bg-accent font-medium' : ''
                    }`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
  );
}

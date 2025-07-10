import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { BlogPost } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface BlogPostListProps {
  posts: BlogPost[];
  totalPosts: number;
  postsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  variant?: 'grid' | 'list';
  className?: string;
}

export function BlogPostList({
  posts,
  totalPosts,
  postsPerPage = 9,
  currentPage,
  onPageChange,
  loading = false,
  variant = 'grid',
  className = '',
}: BlogPostListProps) {
  const [searchParams] = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're on the client before rendering to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const hasPagination = totalPages > 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show max 5 page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show loading skeleton only when there are no posts yet
  if (loading && !posts.length) {
    return (
      <div className={cn(
        'grid gap-6',
        variant === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1',
        className
      )}>
        {[...Array(postsPerPage)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // If loading but we have posts, show the posts with a loading overlay
  if (loading && posts.length > 0) {
    return (
      <div className="relative">
        <div className={cn(
          'grid gap-6',
          variant === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1',
          className,
          loading ? 'opacity-50' : ''
        )}>
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt || ''}
              category={post.category}
              publishedAt={post.published_at || post.created_at}
              readTime={post.average_read_time}
              viewCount={post.view_count}
              imageUrl={post.featured_image_url || undefined}
              tags={post.tags}
              variant={variant === 'list' ? 'minimal' : 'default'}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No posts found</h3>
        <p className="text-muted-foreground">
          {searchParams.get('search')
            ? 'Try adjusting your search or filter to find what you\'re looking for.'
            : 'Check back later for new posts.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={cn(
        'grid gap-6',
        variant === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1',
        className
      )}>
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt || ''}
            category={post.category}
            publishedAt={post.published_at || post.created_at}
            readTime={post.average_read_time}
            viewCount={post.view_count}
            imageUrl={post.featured_image_url || undefined}
            tags={post.tags}
            variant={variant === 'list' ? 'minimal' : 'default'}
          />
        ))}
      </div>

      {hasPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * postsPerPage, totalPosts)}
            </span>{' '}
            of <span className="font-medium">{totalPosts}</span> posts
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {getPageNumbers().map((page) => {
              // Show ellipsis for gaps in pagination
              if (page === 1 && currentPage > 3) {
                return (
                  <div key="start-ellipsis" className="flex items-center">
                    <Button
                      variant={currentPage === 1 ? 'default' : 'ghost'}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => onPageChange(1)}
                    >
                      1
                    </Button>
                    <span className="px-2 text-muted-foreground">...</span>
                  </div>
                );
              }
              
              // Show page number
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            {currentPage < totalPages - 2 && (
              <div key="end-ellipsis" className="flex items-center">
                <span className="px-2 text-muted-foreground">...</span>
                <Button
                  variant={currentPage === totalPages ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to handle class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

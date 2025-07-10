import { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { BlogPost } from '@/services/blogService';
import { getFeaturedPosts } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedPosts() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const posts = await getFeaturedPosts(3);
        setFeaturedPosts(posts);
      } catch (err) {
        console.error('Error fetching featured posts:', err);
        setError('Failed to load featured posts');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (error) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="ghost" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return null; // Don't render anything if no featured posts
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Posts</h2>
        <Button variant="ghost" asChild>
          <Link to="/blog" className="flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
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
            variant="featured"
          />
        ))}
      </div>
    </section>
  );
}

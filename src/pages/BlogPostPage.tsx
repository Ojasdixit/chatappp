import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Facebook, Twitter, Linkedin, Clock, MessageCircle, Eye, Share2 } from 'lucide-react';
import { getPostBySlug, getRelatedPosts, BlogPost, trackSearchTerm } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const postData = await getPostBySlug(slug);
        if (!postData) {
          navigate('/404', { replace: true });
          return;
        }
        
        setPost(postData);
        
        // Fetch related posts
        const related = await getRelatedPosts(postData.id);
        setRelatedPosts(related);
        
        // Update document title for SEO
        document.title = `${postData.seo_title || postData.title} | Free Indian Chat`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && postData.seo_description) {
          metaDescription.setAttribute('content', postData.seo_description);
        }
        
        // Track search term if coming from search
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
          trackSearchTerm(searchQuery);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  const handleShare = (platform: string) => {
    const text = post?.title || '';
    const url = shareUrl;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You might want to show a toast notification here
        break;
      default:
        break;
    }
  };

  if (loading || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-96 w-full mb-8 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
          <Skeleton className="h-6 w-5/6 mt-8" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  const readTime = post.average_read_time || Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article>
        {/* Category and Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {post.category && (
            <Link 
              to={`/blog?category=${post.category.slug}`}
              className="text-primary font-medium hover:underline"
            >
              {post.category.name}
            </Link>
          )}
          <span>•</span>
          <time dateTime={post.published_at || post.created_at}>
            {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
          </time>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Eye className="w-4 h-4" />
            <span>{post.view_count} views</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/blog?tag=${tag.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-8 pt-6 border-t flex flex-wrap items-center gap-4">
          <span className="font-medium">Share:</span>
          <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare('copy')}>
            <Share2 className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  {relatedPost.featured_image_url && (
                    <div className="relative pt-[56.25%] overflow-hidden rounded-t-lg">
                      <img
                        src={relatedPost.featured_image_url}
                        alt={relatedPost.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

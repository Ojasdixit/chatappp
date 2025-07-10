import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BlogCategory } from '@/services/blogService';

interface BlogNavigationProps {
  categories?: BlogCategory[];
  loading?: boolean;
}

export function BlogNavigation({ categories = [], loading = false }: BlogNavigationProps) {
  const location = useLocation();
  
  // Extract category from URL
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentSearch = searchParams.get('search');

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/blog"
              className={cn(
                'block px-3 py-2 rounded-md transition-colors',
                !currentCategory && !currentSearch
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-accent/50'
              )}
            >
              All Posts
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/blog?category=${category.slug}`}
                className={cn(
                  'block px-3 py-2 rounded-md transition-colors',
                  currentCategory === category.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-accent/50'
                )}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'omegle', 'chatroulette', 'random chat', 'video chat', 'stranger chat',
            'online dating', 'make friends', 'anonymous chat', 'free chat', 'meet new people'
          ].map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors',
                searchParams.get('tag') === tag.toLowerCase().replace(/\s+/g, '-')
                  ? 'ring-2 ring-primary/50'
                  : ''
              )}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">Trending Now</h3>
        <ul className="space-y-3">
          {[
            'Best Omegle Alternatives in 2025',
            'How to Stay Safe on Random Chat Apps',
            'Top 10 Video Chat Apps for Meeting New People'
          ].map((title, i) => (
            <li key={i}>
              <Link 
                to={`/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                className="text-sm hover:text-primary transition-colors line-clamp-2"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

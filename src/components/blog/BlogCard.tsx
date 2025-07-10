import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, Eye } from 'lucide-react';

interface BlogCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  publishedAt: string;
  readTime?: number;
  viewCount: number;
  imageUrl?: string | null;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  className?: string;
  variant?: 'default' | 'featured' | 'minimal';
}

export function BlogCard({
  id,
  slug,
  title,
  excerpt,
  category,
  publishedAt,
  readTime,
  viewCount,
  imageUrl,
  tags = [],
  className,
  variant = 'default',
}: BlogCardProps) {
  const calculatedReadTime = readTime || Math.ceil(excerpt.split(/\s+/).length / 200);
  
  if (variant === 'minimal') {
    return (
      <Link to={`/blog/${slug}`} className={cn('block group', className)}>
        <div className="flex items-start gap-4">
          {imageUrl && (
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>{formatDate(publishedAt, { formatStr: 'MMM d, yyyy' })}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{viewCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={cn('group overflow-hidden h-full flex flex-col', className)}>
        <div className="relative pt-[56.25%] overflow-hidden">
          <img
            src={imageUrl || '/placeholder-blog.jpg'}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {category && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 z-10"
              asChild
            >
              <Link to={`/blog?category=${category.slug}`}>
                {category.name}
              </Link>
            </Badge>
          )}
        </div>
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              <Link to={`/blog/${slug}`} className="line-clamp-2">
                {title}
              </Link>
            </h3>
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{calculatedReadTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{viewCount}</span>
              </div>
            </div>
            <span>{formatDate(publishedAt, { formatStr: 'MMM d, yyyy' })}</span>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn('group overflow-hidden h-full flex flex-col', className)}>
      <div className="relative pt-[56.25%] overflow-hidden">
        <img
          src={imageUrl || '/placeholder-blog.jpg'}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardHeader className="flex-1">
        {category && (
          <Badge 
            variant="outline" 
            className="w-fit mb-2"
            asChild
          >
            <Link to={`/blog?category=${category.slug}`}>
              {category.name}
            </Link>
          </Badge>
        )}
        <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          <Link to={`/blog/${slug}`} className="line-clamp-2">
            {title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{calculatedReadTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{viewCount}</span>
          </div>
          <span>{formatDate(publishedAt, { formatStr: 'MMM d' })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

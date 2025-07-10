import { Link } from 'react-router-dom';
import { BlogCategory } from '@/services/blogService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionProps {
  categories: BlogCategory[];
  loading?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const defaultCategories = [
  {
    id: 'viral-videos',
    name: 'Viral Videos',
    slug: 'viral-videos',
    description: 'Latest trending viral videos from India',
  },
  {
    id: 'mms-leaks',
    name: 'MMS Leaks',
    slug: 'mms-leaks',
    description: 'Latest MMS leaks and scandals',
  },
  {
    id: 'viral-news',
    name: 'Viral News',
    slug: 'viral-news',
    description: 'Trending news stories from India',
  },
  {
    id: 'dating-tips',
    name: 'Dating Tips',
    slug: 'dating-tips',
    description: 'Tips and advice for online dating',
  },
  {
    id: 'app-guides',
    name: 'App Guides',
    slug: 'app-guides',
    description: 'Guides for using chat and dating apps',
  },
  {
    id: 'safety-tips',
    name: 'Safety Tips',
    slug: 'safety-tips',
    description: 'Online safety and privacy tips',
  },
];

export function CategorySection(props: CategorySectionProps) {
  const { 
    categories = [],
    loading = false,
    title = 'Browse by Category',
    description = 'Explore our latest posts by category',
    className = '',
  } = props;
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  
  if (loading) {
    return (
      <section className={className}>
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 max-w-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <div className="mt-4 pt-4 border-t">
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCategories.map((category) => (
          <Link 
            key={category.id} 
            to={`/blog?category=${category.slug}`}
            className="block h-full group"
          >
            <Card className="h-full hover:shadow-md transition-shadow border-2 border-transparent group-hover:border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-primary font-medium">
                  Explore posts
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

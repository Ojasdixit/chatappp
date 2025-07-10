import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BlogSearch({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update search query when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(location.search);
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
      // Reset to first page on new search
      params.delete('page');
    } else {
      params.delete('search');
    }
    
    // Preserve other query params
    navigate(`/blog?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate(`/blog?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search blog posts..."
          className="pl-10 pr-10 py-5 rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      {/* Search suggestions - shown when input is focused */}
      {isFocused && searchQuery && (
        <div className="absolute z-10 mt-1 w-full bg-popover rounded-lg shadow-lg border">
          <div className="p-2 text-sm text-muted-foreground">
            <p className="px-3 py-1.5">Press Enter to search for "{searchQuery}"</p>
          </div>
          <div className="border-t p-2">
            <h4 className="px-3 py-1 text-xs font-medium text-muted-foreground">Popular Searches</h4>
            <ul>
              {[
                'omegle alternatives',
                'random chat apps',
                'video chat safety tips',
                'best anonymous chat sites',
                'make friends online'
              ].filter(term => 
                term.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((term, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-1.5 rounded hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setSearchQuery(term);
                      // Small delay to allow the input to update
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }, 0);
                    }}
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (command: string, ...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = function gtag() {
      window.dataLayer.push(arguments as any);
    };
    
    // Initialize with config
    window.gtag('js', new Date());
    window.gtag('config', 'G-CSMY3FY2JK');

    // Load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CSMY3FY2JK';
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  return null;
}

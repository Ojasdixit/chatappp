import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaptchaVerification from "./components/CaptchaVerification";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import ContactUs from "./pages/ContactUs";
import BlogHomePage from "./pages/BlogHomePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Chat App - Accessible at root */}
          <Route 
            path="/" 
            element={
              // For development, bypass captcha. In production, use the commented version below
              // sessionStorage.getItem('captchaVerified') === 'true' ? 
              // <Index /> : 
              // <Navigate to="/verify" state={{ from: '/' }} replace />
              <Index />
            } 
          />
          
          {/* Marketing/Info Pages */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Other Pages */}
          <Route path="/verify" element={<CaptchaVerification />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blog" element={<BlogHomePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

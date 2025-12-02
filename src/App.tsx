import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Funnels from "./pages/Funnels";
import FunnelEditor from "./pages/FunnelEditor";
import FunnelPlayer from "./pages/FunnelPlayer";
import Analytics from "./pages/Analytics";
import FunnelAnalytics from "./pages/FunnelAnalytics";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import Pricing from "./pages/Pricing";
import Notifications from "./pages/Notifications";
import Features from "./pages/Features";
import Resources from "./pages/Resources";
import Documentation from "./pages/Documentation";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/f/:shareToken" element={<FunnelPlayer />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/features" element={<Features />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Protected Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/funnels"
              element={
                <ProtectedRoute>
                  <Funnels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/funnels/:id/edit"
              element={
                <ProtectedRoute>
                  <FunnelEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics/:id"
              element={
                <ProtectedRoute>
                  <FunnelAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

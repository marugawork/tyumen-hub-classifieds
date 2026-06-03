import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { DistrictProvider } from "./contexts/DistrictContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminGuard from "./components/admin/AdminGuard";

// Lazy-load all secondary public pages — keep Index eager for fastest LCP
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ListingPage = lazy(() => import("./pages/ListingPage"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PromotePage = lazy(() => import("./pages/PromotePage"));
const BusinessProfilePage = lazy(() => import("./pages/BusinessProfilePage"));
const DistrictPage = lazy(() => import("./pages/DistrictPage"));
const MyListingsPage = lazy(() => import("./pages/MyListingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-load entire admin area — heavy and rarely used by visitors
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminListings = lazy(() => import("./pages/admin/AdminListings"));
const AdminModeration = lazy(() => import("./pages/admin/AdminModeration"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminBusiness = lazy(() => import("./pages/admin/AdminBusiness"));
const AdminAds = lazy(() => import("./pages/admin/AdminAds"));
const AdminDirectAds = lazy(() => import("./pages/admin/AdminDirectAds"));
const AdminPromotion = lazy(() => import("./pages/admin/AdminPromotion"));
const AdminFinances = lazy(() => import("./pages/admin/AdminFinances"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminDistricts = lazy(() => import("./pages/admin/AdminDistricts"));
const AdminTariffs = lazy(() => import("./pages/admin/AdminTariffs"));
const AdminLogs = lazy(() => import("./pages/admin/AdminLogs"));
const AdminGrowthDashboard = lazy(() => import("./pages/admin/AdminGrowthDashboard"));
const AdminGrowthAnalytics = lazy(() => import("./pages/admin/AdminGrowthAnalytics"));
const AdminGrowthRecommendations = lazy(() => import("./pages/admin/AdminGrowthRecommendations"));
const AdminGrowthSeed = lazy(() => import("./pages/admin/AdminGrowthSeed"));
const AdminGrowthImport = lazy(() => import("./pages/admin/AdminGrowthImport"));
const AdminGrowthEmptyCategories = lazy(() => import("./pages/admin/AdminGrowthEmptyCategories"));
const AdminGrowthPromotionAdvisor = lazy(() => import("./pages/admin/AdminGrowthPromotionAdvisor"));
const AdminGrowthTrends = lazy(() => import("./pages/admin/AdminGrowthTrends"));
const AdminGrowthCenter = lazy(() => import("./pages/admin/AdminGrowthCenter"));
const AdminAIModeration = lazy(() => import("./pages/admin/AdminAIModeration"));
const AdminAntiFraud = lazy(() => import("./pages/admin/AdminAntiFraud"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — data considered fresh
      gcTime: 30 * 60 * 1000, // 30 min — keep cache around
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DistrictProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/district/:slug" element={<DistrictPage />} />
                <Route path="/listing/:id" element={<ListingPage />} />
                <Route path="/create" element={<CreateListing />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/promote/:id" element={<PromotePage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/business-profile" element={<BusinessProfilePage />} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/admin/listings" element={<AdminGuard><AdminListings /></AdminGuard>} />
                <Route path="/admin/moderation" element={<AdminGuard><AdminModeration /></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
                <Route path="/admin/business" element={<AdminGuard><AdminBusiness /></AdminGuard>} />
                <Route path="/admin/ads" element={<AdminGuard><AdminAds /></AdminGuard>} />
                <Route path="/admin/direct-ads" element={<AdminGuard><AdminDirectAds /></AdminGuard>} />
                <Route path="/admin/promotion" element={<AdminGuard><AdminPromotion /></AdminGuard>} />
                <Route path="/admin/finances" element={<AdminGuard><AdminFinances /></AdminGuard>} />
                <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
                <Route path="/admin/districts" element={<AdminGuard><AdminDistricts /></AdminGuard>} />
                <Route path="/admin/tariffs" element={<AdminGuard><AdminTariffs /></AdminGuard>} />
                <Route path="/admin/logs" element={<AdminGuard><AdminLogs /></AdminGuard>} />
                <Route path="/admin/growth" element={<AdminGuard><AdminGrowthDashboard /></AdminGuard>} />
                <Route path="/admin/growth/analytics" element={<AdminGuard><AdminGrowthAnalytics /></AdminGuard>} />
                <Route path="/admin/growth/recommendations" element={<AdminGuard><AdminGrowthRecommendations /></AdminGuard>} />
                <Route path="/admin/growth/seed" element={<AdminGuard><AdminGrowthSeed /></AdminGuard>} />
                <Route path="/admin/growth/import" element={<AdminGuard><AdminGrowthImport /></AdminGuard>} />
                <Route path="/admin/growth/empty-categories" element={<AdminGuard><AdminGrowthEmptyCategories /></AdminGuard>} />
                <Route path="/admin/growth/promotion-advisor" element={<AdminGuard><AdminGrowthPromotionAdvisor /></AdminGuard>} />
                <Route path="/admin/growth/trends" element={<AdminGuard><AdminGrowthTrends /></AdminGuard>} />
                <Route path="/admin/growth-center" element={<AdminGuard><AdminGrowthCenter /></AdminGuard>} />
                <Route path="/admin/ai-moderation" element={<AdminGuard><AdminAIModeration /></AdminGuard>} />
                <Route path="/admin/anti-fraud" element={<AdminGuard><AdminAntiFraud /></AdminGuard>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AdminAuthProvider>
      </DistrictProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
            </Suspense>
          </BrowserRouter>
        </AdminAuthProvider>
      </DistrictProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import ListingPage from "./pages/ListingPage";
import CreateListing from "./pages/CreateListing";
import FavoritesPage from "./pages/FavoritesPage";
import HelpPage from "./pages/HelpPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import PricingPage from "./pages/PricingPage";
import PaymentPage from "./pages/PaymentPage";
import PromotePage from "./pages/PromotePage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import DistrictPage from "./pages/DistrictPage";
import MyListingsPage from "./pages/MyListingsPage";
import NotFound from "./pages/NotFound";
import { DistrictProvider } from "./contexts/DistrictContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminListings from "./pages/admin/AdminListings";
import AdminModeration from "./pages/admin/AdminModeration";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBusiness from "./pages/admin/AdminBusiness";
import AdminAds from "./pages/admin/AdminAds";
import AdminDirectAds from "./pages/admin/AdminDirectAds";
import AdminPromotion from "./pages/admin/AdminPromotion";
import AdminFinances from "./pages/admin/AdminFinances";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminDistricts from "./pages/admin/AdminDistricts";
import AdminTariffs from "./pages/admin/AdminTariffs";
import AdminLogs from "./pages/admin/AdminLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DistrictProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </DistrictProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

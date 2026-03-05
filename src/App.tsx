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
import AdminPage from "./pages/AdminPage";
import DistrictPage from "./pages/DistrictPage";
import MyListingsPage from "./pages/MyListingsPage";
import NotFound from "./pages/NotFound";
import { DistrictProvider } from "./contexts/DistrictContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DistrictProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
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
            <Route path="/business-profile" element={<BusinessProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DistrictProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

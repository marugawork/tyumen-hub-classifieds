import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { useFavorites } from "@/hooks/useFavorites";
import { listings } from "@/data/listings";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Избранное</h1>
        <p className="text-sm text-muted-foreground mb-6">{favListings.length} объявлений</p>
        {favListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">Нет избранных объявлений</p>
            <Link to="/" className="text-accent text-sm mt-2 inline-block font-semibold">К объявлениям</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

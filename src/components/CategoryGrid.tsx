import { Link } from "react-router-dom";
import { categories } from "@/data/categories";
import { listings } from "@/data/listings";

import catTransport from "@/assets/cat-transport.png";
import catRealty from "@/assets/cat-realty.png";
import catWork from "@/assets/cat-work.png";
import catServices from "@/assets/cat-services.png";
import catPersonal from "@/assets/cat-personal.png";
import catHome from "@/assets/cat-home.png";
import catElectronics from "@/assets/cat-electronics.png";
import catHobby from "@/assets/cat-hobby.png";
import catAnimals from "@/assets/cat-animals.png";
import catBusiness from "@/assets/cat-business.png";
import catFree from "@/assets/cat-free.png";
import catExchange from "@/assets/cat-exchange.png";

const categoryImages: Record<string, string> = {
  transport: catTransport,
  realty: catRealty,
  work: catWork,
  services: catServices,
  personal: catPersonal,
  home: catHome,
  electronics: catElectronics,
  hobby: catHobby,
  animals: catAnimals,
  business: catBusiness,
  free: catFree,
  exchange: catExchange,
};

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-8">
      {categories.map(cat => {
        const count = listings.filter(l => l.categoryId === cat.id).length;
        const imgSrc = categoryImages[cat.id];
        return (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              {imgSrc ? (
                <img src={imgSrc} alt={cat.name} className="w-full h-full object-contain drop-shadow-none" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <cat.icon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-foreground leading-tight mb-1">
              {cat.name}
            </span>
            <span className="text-xs text-muted-foreground">{count} объявл.</span>
          </Link>
        );
      })}
    </div>
  );
}

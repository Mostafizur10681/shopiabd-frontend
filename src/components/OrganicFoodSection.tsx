"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const defaultOrganicProducts = [
  {
    id: "org-1",
    name: "Naturya Organic Maca Powder (300 gm)",
    price: 1890.00,
    originalPrice: 2600.00,
    rating: 5,
    isSale: true,
    mainImage: "/prod_maca.png"
  },
  {
    id: "org-2",
    name: "DULAL CHANDRA BHAR TALMISRI (দুলাল চন্দ্র ভড়ের তালমিছরি)",
    price: 350.00,
    originalPrice: null,
    rating: 5,
    isSale: false,
    mainImage: "/prod_talmisri.png"
  },
  {
    id: "org-3",
    name: "Naturya Maca Powder 125 gm",
    price: 1150.00,
    originalPrice: 1590.00,
    rating: 5,
    isSale: true,
    mainImage: "/prod_maca.png"
  },
  {
    id: "org-4",
    name: "Swanson Maca Capsule 500 mg Capsule",
    price: 1450.00,
    originalPrice: 1650.00,
    rating: 5,
    isSale: true,
    mainImage: "/prod_maca.png"
  },
  {
    id: "org-5",
    name: "Mustard Oil (সরিষার তেল)",
    price: 280.00,
    originalPrice: null,
    rating: 5,
    isSale: false,
    mainImage: "/prod_blackseed.png"
  },
  {
    id: "org-6",
    name: "Extra Virgin Organic Coconut Oil (250 ml)",
    price: 370.00,
    originalPrice: null,
    rating: 5,
    isSale: false,
    mainImage: "/prod_honey.png"
  }
];

interface OrganicFoodSectionProps {
  products?: any[];
}

export function OrganicFoodSection({ products: initialProducts }: OrganicFoodSectionProps) {
  const { addToCart, addToWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [items, setItems] = useState<any[]>(defaultOrganicProducts);
  const [bannerImgError, setBannerImgError] = useState(false);

  const bannerImage = items && items.length > 0 && items[0]?.mainImage ? items[0].mainImage : null;

  useEffect(() => {
    setBannerImgError(false);
  }, [items]);

  useEffect(() => {
    const processProducts = (rawList: any[]) => {
      if (!Array.isArray(rawList) || rawList.length === 0) return [];

      const normalized = rawList.map((p: any) => {
        const priceVal = typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0)) || 0;
        const saleVal = p.sale_price ? parseFloat(String(p.sale_price)) : 0;
        let origPrice: number | undefined = undefined;
        if (p.originalPrice && parseFloat(String(p.originalPrice)) > priceVal) {
          origPrice = parseFloat(String(p.originalPrice));
        } else if (saleVal > 0 && priceVal > saleVal) {
          origPrice = priceVal;
        }
        return {
          id: p.id,
          name: p.name || "",
          slug: p.slug || String(p.id),
          category: typeof p.category === "string" ? p.category : (p.category?.name || "General"),
          price: saleVal > 0 && priceVal > saleVal ? saleVal : priceVal,
          originalPrice: origPrice,
          mainImage: p.main_image || p.image || p.mainImage || (Array.isArray(p.images) && p.images[0]) || "/prod_chia.png",
          rating: p.rating ? parseFloat(String(p.rating)) : 5,
          isSale: Boolean(p.isSale || p.sale_price || p.is_sale),
        };
      });

      const keywords = ["organic", "food", "maca", "chia", "honey", "oil", "seed", "powder", "supplement", "nut", "grocery", "talmisri", "mustard"];
      const filtered = normalized.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        return keywords.some((kw) => cat.includes(kw) || name.includes(kw));
      });

      if (filtered.length >= 6) return filtered.slice(0, 6);

      const ids = new Set(filtered.map(f => f.id));
      const remaining = normalized.filter(p => !ids.has(p.id));
      return [...filtered, ...remaining].slice(0, 6);
    };

    if (initialProducts && initialProducts.length > 0) {
      const processed = processProducts(initialProducts);
      if (processed.length > 0) {
        setItems(processed);
        return;
      }
    }

    const fetchApiProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/products?per_page=50`);
        if (!res.ok) return;
        const json = await res.json();
        const list = json.data?.data || json.data || [];
        const processed = processProducts(list);
        if (processed.length > 0) {
          setItems(processed);
        }
      } catch {
        // Keep default static items
      }
    };

    fetchApiProducts();
  }, [initialProducts]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
        
        {/* Left Side: 6-Product Grid Container (Col 8) */}
        <div className="lg:col-span-8 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 order-2 lg:order-1">
          {items.map((prod) => (
            <div 
              key={prod.id} 
              className="p-5 flex flex-col justify-between bg-white hover:shadow-xl transition-all duration-300 relative group/org overflow-hidden"
            >
              <div>
                {/* Product Image Container with Right-Side Hover Action Icons */}
                <div className="w-full h-44 bg-white rounded-lg flex items-center justify-center overflow-hidden relative mb-4">
                  {prod.isSale && (
                    <span className="absolute top-0 left-0 z-10 bg-[#ff8c00] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      SALE
                    </span>
                  )}

                  <Link href={`/product/${(prod as any).slug || prod.id}`} className="relative w-full h-full block">
                    <img 
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2 group-hover/org:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/prod_chia.png"; }}
                    />
                  </Link>

                  {/* Vertical Action Bar on Hover (Top Right) */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover/org:opacity-100 transition-all duration-300 translate-x-3 group-hover/org:translate-x-0">
                    <button 
                      type="button"
                      onClick={() => addToWishlist(prod)}
                      title={isInWishlist(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      aria-label="Add to Wishlist"
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                        isInWishlist(prod.id) 
                          ? "bg-[#e60000] text-white" 
                          : "bg-white text-slate-700 hover:bg-[#0b3b82] hover:text-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(prod.id) ? "fill-white" : ""}`} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => setQuickViewProduct(prod)}
                      title="Quick View"
                      aria-label="Quick View"
                      className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-[#0b3b82] hover:text-white flex items-center justify-center shadow-md transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button 
                      type="button"
                      onClick={() => addToCart(prod, 1)}
                      title="Add to Cart"
                      aria-label="Add to Cart"
                      className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-[#ff8c00] hover:text-white flex items-center justify-center shadow-md transition-all duration-200"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <Link href={`/product/${(prod as any).slug || prod.id}`}>
                  <h3 className="font-medium text-slate-700 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-relaxed min-h-[36px] mb-3">
                    {prod.name}
                  </h3>
                </Link>
              </div>

              {/* Price & Rating */}
              <div className="space-y-1.5 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#ff8c00] font-bold text-sm">
                    ৳{typeof prod.price === "number" ? prod.price.toLocaleString("en-US", { minimumFractionDigits: 2 }) : prod.price}
                  </span>
                  {Boolean(prod.originalPrice && prod.originalPrice > prod.price) && (
                    <span className="text-slate-400 line-through text-[11px]">
                      ৳{typeof prod.originalPrice === "number" ? prod.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 }) : prod.originalPrice}
                    </span>
                  )}
                </div>

                {/* 5-Star Rating Icons */}
                <div className="flex items-center text-slate-300 gap-0.5 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-slate-200 text-slate-200" />
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Right Side: Deep Navy Banner Box (Col 4) */}
        <div className={`lg:col-span-4 bg-[#0B3B82] p-8 sm:p-10 flex flex-col ${bannerImage && !bannerImgError ? "justify-between" : "justify-center items-center"} relative overflow-hidden min-h-[440px] order-1 lg:order-2 text-center`}>
          {/* Subtle background circular pattern design */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />

          {/* Banner Heading */}
          <div className="relative z-10 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-wide">
              Stay focused <br />
              with best <br />
              <span className="text-white">Organic Foods</span>
            </h2>
          </div>

          {/* Banner Graphic Showcase (Shown ONLY if image is available and loads cleanly) */}
          {bannerImage && !bannerImgError && (
            <div className="relative z-10 w-full h-64 mt-6 flex items-center justify-center">
              <div className="w-full h-full relative">
                <img 
                  src={bannerImage} 
                  alt="Organic Food Showcase"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  onError={() => setBannerImgError(true)}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

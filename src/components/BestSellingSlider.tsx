"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function BestSellingSlider({ products }: { products: any[] }) {
  const { addToCart, addToWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const visibleCount = 5;

  const normalizedList = (products || []).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug || String(p.id),
    category: typeof p.category === "string" ? p.category : (p.category?.name || "General"),
    price: typeof p.price === "number" ? p.price : parseFloat(p.price || 0),
    originalPrice: p.originalPrice || (p.sale_price && p.price ? parseFloat(String(p.price)) : undefined),
    mainImage: p.image || p.mainImage || "https://placehold.co/300x300/f1f5f9/94a3b8?text=Product",
    rating: p.rating ? parseFloat(String(p.rating)) : 5,
    discountPercentage: p.discountPercentage || (p.sale_price && p.price ? Math.round(((parseFloat(p.price) - parseFloat(p.sale_price)) / parseFloat(p.price)) * 100) : undefined),
    isBestSeller: Boolean(p.best_seller || p.isBestSeller),
  }));

  const bestSellers = normalizedList.filter((p) => p.isBestSeller);
  const displayList = bestSellers.length > 0 ? bestSellers : normalizedList;
  const totalItems = displayList.length || 1;
  const totalPages = Math.ceil(totalItems / visibleCount) || 1;

  useEffect(() => {
    if (isPaused || totalItems <= visibleCount) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % totalItems);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, totalItems, visibleCount]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => (prev + 1) % totalItems);
  };

  const getVisibleProducts = () => {
    if (displayList.length === 0) return [];
    const items = [];
    for (let i = 0; i < Math.min(visibleCount, displayList.length); i++) {
      const idx = (startIndex + i) % totalItems;
      items.push(displayList[idx]);
    }
    return items;
  };

  const visibleProducts = getVisibleProducts();
  const activeDotIndex = Math.floor(startIndex / Math.max(1, Math.floor(totalItems / totalPages))) % totalPages;

  return (
    <div 
      className="w-full space-y-6 pt-10 pb-8 relative z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title with increased spacing and title case */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#0b3b82] tracking-wide">
          Best Selling Products
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative max-w-7xl mx-auto px-10">
        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          type="button"
          aria-label="Previous Best Selling Products"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-slate-700 hover:text-[#0b3b82] p-3 rounded-full shadow-xl border border-slate-200 z-30 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button 
          onClick={handleNext}
          type="button"
          aria-label="Next Best Selling Products"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-slate-700 hover:text-[#0b3b82] p-3 rounded-full shadow-xl border border-slate-200 z-30 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Responsive Grid Card Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100 relative z-10">
          {visibleProducts.map((prod, idx) => (
            <div 
              key={`${prod.id}-${idx}`} 
              className="p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white relative group/card overflow-hidden"
            >
              {/* SALE Badge */}
              {prod.discountPercentage && (
                <span className="absolute top-3 left-3 z-10 bg-[#ff8c00] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  SALE
                </span>
              )}

              <div>
                {/* Image Container with Right-Side Hover Action Icons */}
                <div className="w-full h-44 bg-white rounded-md flex items-center justify-center overflow-hidden relative mb-3 group-hover/card:scale-105 transition-transform duration-300">
                  <Link href={`/product/${prod.slug || prod.id}`} className="relative w-full h-full block">
                    <Image 
                      src={prod.mainImage} 
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain p-2"
                    />
                  </Link>

                  {/* Vertical Hover Action Bar on the Right Side */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-3 group-hover/card:translate-x-0">
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

                {/* Title */}
                <Link href={`/product/${prod.slug || prod.id}`}>
                  <h3 className="font-semibold text-slate-800 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-snug mb-2 min-h-[32px]">
                    {prod.name}
                  </h3>
                </Link>
              </div>

              {/* Price & Star Rating */}
              <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#ff8c00] font-bold text-sm">
                    ৳{prod.price.toFixed(2)}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-slate-400 line-through text-[11px]">
                      ৳{prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Star rating icons */}
                <div className="flex items-center text-slate-300 gap-0.5 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(prod.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Option matching user screenshot */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {[...Array(3)].map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setStartIndex(dotIdx * Math.floor(totalItems / 3))}
            aria-label={`Go to slide page ${dotIdx + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeDotIndex === dotIdx 
                ? "bg-[#0b3b82] scale-110 shadow-sm" 
                : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

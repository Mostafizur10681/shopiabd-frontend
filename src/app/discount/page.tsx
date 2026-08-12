"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Eye, ShoppingBag, Percent, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import productsData from "@/data/products.json";

export default function DiscountPage() {
  const { addToCart, addToWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [products, setProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("discount-high");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/products?per_page=50`)
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data?.data || data?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((p: any) => {
            const rawPrice = parseFloat(String(p.price || 0)) || 0;
            const rawSale = p.sale_price ? parseFloat(String(p.sale_price)) : null;
            return {
              id: p.id,
              name: p.name,
              slug: p.slug || String(p.id),
              category: typeof p.category === "string" ? p.category : (p.category?.name || "General"),
              price: rawSale && rawSale > 0 ? rawSale : rawPrice,
              originalPrice: rawSale && rawSale > 0 ? rawPrice : undefined,
              mainImage: p.image || p.main_image || (Array.isArray(p.images) && p.images[0]) || "https://placehold.co/300x300",
              rating: p.rating ? parseFloat(String(p.rating)) : 4.9,
              reviewsCount: p.reviews_count || 24,
              discountPercentage: rawSale && rawPrice > rawSale ? Math.round(((rawPrice - rawSale) / rawPrice) * 100) : (p.discountPercentage || 15),
            };
          });
          setProducts(mapped);
        } else {
          setProducts(productsData);
        }
      })
      .catch(() => {
        setProducts(productsData);
      });
  }, []);

  const sourceProducts = products.length > 0 ? products : productsData;
  const discountedProducts = sourceProducts.filter((p) => p.originalPrice || p.discountPercentage);
  const displayItems = discountedProducts.length > 0 ? discountedProducts : sourceProducts;

  const sortedProducts = [...displayItems].sort((a, b) => {
    if (sortBy === "discount-high") {
      const discA = a.discountPercentage || 15;
      const discB = b.discountPercentage || 15;
      return discB - discA;
    }
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-10 pb-20">
      
      {/* Hero Banner with #0B3B82 background */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#0b3b82] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Percent className="w-4 h-4 text-amber-400" /> Exclusive Savings &amp; Special Deals
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide leading-tight">
            Discounted Products
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-xs sm:text-sm leading-relaxed">
            Shop premium organic foods, health supplements, and skin care with discounts up to 35% off.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Filter and Sort Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-extrabold text-slate-800">
            Showing <span className="text-[#0b3b82] font-black">{sortedProducts.length}</span> Special Discounted Items
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
            >
              <option value="discount-high">Biggest Discount %</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {sortedProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white relative group/card overflow-hidden"
            >
              {/* SALE & Discount Badge */}
              <span className="absolute top-3 left-3 z-10 bg-[#ff8c00] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                {prod.discountPercentage ? `-${prod.discountPercentage}% OFF` : "SAVE BIG"}
              </span>

              <div>
                {/* Product Image */}
                <div className="w-full h-44 bg-white rounded-lg flex items-center justify-center overflow-hidden relative mb-4">
                  <Link href={`/product/${prod.slug || prod.id}`} className="relative w-full h-full block">
                    <Image 
                      src={prod.mainImage}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain p-2 group-hover/card:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Vertical Hover Action Icons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-3 group-hover/card:translate-x-0">
                    <button
                      type="button"
                      onClick={() => addToWishlist(prod)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        isInWishlist(prod.id)
                          ? "bg-rose-500 text-white"
                          : "bg-white text-slate-600 hover:bg-[#0b3b82] hover:text-white"
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(prod)}
                      className="w-8 h-8 rounded-full bg-white text-slate-600 hover:bg-[#0b3b82] hover:text-white flex items-center justify-center shadow-md transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-400 ml-1">({prod.reviewsCount || 15})</span>
                </div>

                {/* Title */}
                <Link href={`/product/${prod.slug || prod.id}`}>
                  <h3 className="font-bold text-slate-800 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-snug mb-3 min-h-[32px]">
                    {prod.name}
                  </h3>
                </Link>
              </div>

              {/* Footer Price */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-black text-[#0b3b82] block">
                    ৳{prod.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ৳{prod.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(prod, 1)}
                  className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

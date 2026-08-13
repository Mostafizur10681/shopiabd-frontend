"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import { useShop } from "@/context/ShopContext";
import { Sparkles, Heart, Eye, ShoppingCart, Percent, Flame, Clock } from "lucide-react";

export default function SalesPage() {
  const { addToCart, addToWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("discount-high");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/products?per_page=100`)
      .then((res) => res.json())
      .then((data) => {
        const list: any[] = data?.data?.data || data?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list
            .map((p: any) => {
              const rawPrice = parseFloat(String(p.price || 0)) || 0;
              const rawSale = p.sale_price !== null && p.sale_price !== undefined ? parseFloat(String(p.sale_price)) : null;
              const hasDiscount = rawSale !== null && rawSale > 0 && rawSale < rawPrice;
              
              let originalPrice: number | undefined = undefined;
              let activePrice = rawPrice;

              if (hasDiscount) {
                activePrice = rawSale!;
                originalPrice = rawPrice;
              } else if (p.originalPrice && parseFloat(String(p.originalPrice)) > rawPrice) {
                originalPrice = parseFloat(String(p.originalPrice));
              } else if (p.original_price && parseFloat(String(p.original_price)) > rawPrice) {
                originalPrice = parseFloat(String(p.original_price));
              }

              const discountPercentage = originalPrice && originalPrice > activePrice
                ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
                : (p.discount ? parseFloat(String(p.discount)) : undefined);

              const mainImage =
                p.image ||
                p.main_image ||
                p.mainImage ||
                (Array.isArray(p.images) && p.images[0]) ||
                "https://placehold.co/400x400";

              return {
                id: p.id,
                name: p.name || "Product",
                slug: p.slug || String(p.id),
                category: typeof p.category === "string" ? p.category : (p.category?.name || "General"),
                price: activePrice,
                originalPrice,
                discountPercentage,
                mainImage,
                rating: p.rating ? parseFloat(String(p.rating)) : 4.9,
                reviewsCount: p.reviews_count || p.reviewsCount || 18,
                isBestSeller: Boolean(p.best_seller || p.isBestSeller),
              };
            })
            .filter((p: any) => (p.originalPrice && p.originalPrice > p.price) || (p.discountPercentage && p.discountPercentage > 0));

          if (mapped.length > 0) {
            setProducts(mapped);
          } else {
            // If no products on sale in API, fallback to mock products with discounts
            setProducts(productsData.filter((p: any) => p.originalPrice && p.originalPrice > p.price));
          }
        } else {
          setProducts(productsData.filter((p: any) => p.originalPrice && p.originalPrice > p.price));
        }
      })
      .catch(() => {
        setProducts(productsData.filter((p: any) => p.originalPrice && p.originalPrice > p.price));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => {
      return selectedCategory === "All" || p.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "discount-high") {
        const discA = a.discountPercentage || 0;
        const discB = b.discountPercentage || 0;
        return discB - discA;
      }
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-12 pb-20">
      
      {/* 1. Flash Sale Hero Banner */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" /> Mega Discount Offers
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide leading-tight">
            Special Sales &amp; Flash Deals <br className="hidden sm:inline" />
            <span className="text-amber-300 tracking-wide">Up to 35% OFF</span>
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed tracking-wide pt-2">
            Limited-time promotional discounts on authentic organic foods, chia seeds, maca powders, and premium skincare items.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* 2. Top Banner Highlight */}
        <section className="bg-gradient-to-r from-amber-500 to-[#ff8c00] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Clock className="w-3.5 h-3.5" /> Limited Stock Available
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Get Free Nationwide Express Shipping on Orders Over ৳3,000!
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Discounts are automatically calculated at checkout. Cash on delivery available everywhere.
            </p>
          </div>

          <Link
            href="/cart"
            className="bg-[#0b3b82] hover:bg-[#072450] text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md transition shrink-0"
          >
            View Cart &amp; Checkout
          </Link>
        </section>

        {/* 3. Filter and Sort Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0b3b82] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 w-full sm:w-auto justify-end">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
            >
              <option value="discount-high">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* 4. Sale Products Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[#ff8c00] font-bold text-xs uppercase tracking-widest block">
                SPECIAL OFFERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3b82] tracking-tight">
                {loading ? "Loading Deals..." : `Discounted Items (${filteredProducts.length})`}
              </h2>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse flex flex-col justify-between"
                >
                  <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-5 bg-slate-200 rounded w-1/2 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Percent className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Sale Products in this Category</h3>
              <p className="text-sm text-slate-500">Try switching categories or check back later for exciting offers.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="bg-[#0b3b82] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#08295a] transition shadow-xs"
              >
                Show All Deals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const discountPercent = product.discountPercentage || (
                  product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Percent className="w-3 h-3" /> {discountPercent}% OFF
                      </div>
                    )}

                    {/* Top Right Hover Actions Bar */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        type="button"
                        onClick={() => addToWishlist(product)}
                        className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition ${
                          isInWishlist(product.id)
                            ? "bg-rose-500 text-white"
                            : "bg-white text-slate-600 hover:text-rose-600"
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        className="w-8 h-8 rounded-full bg-white text-slate-600 hover:text-[#0b3b82] shadow-md flex items-center justify-center transition"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Image */}
                    <Link 
                      href={`/product/${product.slug || product.id}`}
                      className="relative w-full h-48 bg-slate-50 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center p-4 mb-4 block"
                    >
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain group-hover:scale-105 transition duration-300"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3
                          className="font-bold text-slate-800 text-sm line-clamp-2 cursor-pointer hover:text-[#0b3b82] transition min-h-[40px]"
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price & Cart Button Row */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                        <div>
                          <div className="text-base font-extrabold text-[#0b3b82]">
                            ৳ {product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-slate-400 line-through">
                              ৳ {product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="bg-[#ff8c00] hover:bg-[#e07b00] text-white p-2.5 rounded-full shadow-md transition"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

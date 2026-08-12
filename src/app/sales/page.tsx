"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import { useShop } from "@/context/ShopContext";
import { Sparkles, Heart, Eye, ShoppingCart, Percent, Flame, Clock } from "lucide-react";

export default function SalesPage() {
  const { addToCart, addToWishlist, setQuickViewProduct } = useShop();

  // Filter products that are on sale (where price is less than original price, or top discounted items)
  const saleProducts = productsData.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-16 pb-20">
      
      {/* 1. Flash Sale Hero Banner */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" /> Mega Discount Offers
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-wide leading-tight">
            Special Sales &amp; Flash Deals <br className="hidden sm:inline" />
            <span className="text-amber-300 tracking-wide">Up to 35% OFF</span>
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed tracking-wide pt-2">
            Limited-time promotional discounts on authentic organic foods, chia seeds, maca powders, and premium skincare items.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* 2. Top Banner Highlight */}
        <section className="bg-gradient-to-r from-amber-500 to-[#ff8c00] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              <Clock className="w-3.5 h-3.5" /> Limited Stock Available
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
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

        {/* 3. Sale Products Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[#ff8c00] font-bold text-xs uppercase tracking-widest block">
                SPECIAL OFFERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3b82] tracking-tight">
                Discounted Items ({saleProducts.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 relative group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Percent className="w-3 h-3" /> {discountPercent}% OFF
                  </div>

                  {/* Top Right Hover Actions Bar */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => addToWishlist(product)}
                      className="w-8 h-8 rounded-full bg-white text-slate-600 hover:text-rose-600 shadow-md flex items-center justify-center transition"
                      title="Add to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
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
                        className="font-bold text-slate-800 text-sm line-clamp-2 cursor-pointer hover:text-[#0b3b82] transition"
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price & Cart Button Row */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                      <div>
                        <div className="text-base font-extrabold text-[#0b3b82]">
                          ৳ {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">
                            ৳ {product.originalPrice.toLocaleString()}
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
        </section>

      </div>
    </div>
  );
}

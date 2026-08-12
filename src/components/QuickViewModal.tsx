"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Star, CheckCircle2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const handleClose = () => {
    setQuickViewProduct(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    handleClose();
  };

  const price = typeof quickViewProduct.price === "number" 
    ? quickViewProduct.price 
    : parseFloat(quickViewProduct.price || "0");

  const originalPrice = quickViewProduct.originalPrice 
    ? (typeof quickViewProduct.originalPrice === "number" ? quickViewProduct.originalPrice : parseFloat(quickViewProduct.originalPrice))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Overlay Backdrop Click */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Card Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="relative bg-slate-50/60 p-8 flex items-center justify-center min-h-[320px] md:min-h-[400px]">
          {/* Badges */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            {quickViewProduct.discountPercentage && (
              <span className="bg-[#ff8c00] text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                SALE
              </span>
            )}
            {quickViewProduct.isNew && (
              <span className="bg-[#0b3b82] text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                NEW
              </span>
            )}
          </div>

          <div className="w-full h-72 relative">
            <Image
              src={quickViewProduct.mainImage}
              alt={quickViewProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              priority
            />
          </div>
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Stock Status Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" /> IN STOCK
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-extrabold text-[#0b3b82] leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Rating / Review Link */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(quickViewProduct.rating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400">(Add your review)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-slate-100">
              <span className="text-3xl font-black text-[#ff8c00]">
                ৳{price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-base text-slate-400 line-through font-medium">
                  ৳{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector + Add to Cart Button */}
            <div className="pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity
              </label>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-100/80 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-10 text-center font-bold text-slate-800 text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e07b00] text-white font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Categories & Tags Metadata */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <div>
              <span className="font-bold text-slate-700">Categories: </span>
              <span>Beauty, Skin Care</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Tags: </span>
              <span>Facewash, Organic</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

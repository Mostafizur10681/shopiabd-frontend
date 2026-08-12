"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useShop();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const flatRateShipment = cart.length > 0 ? 60.00 : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + flatRateShipment);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "SHOPIA10") {
      setCouponDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else if (couponCode.trim()) {
      alert("Invalid coupon code. Try 'SHOPIA10' for 10% off.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#0b3b82] transition">Home</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium">Shopping cart</span>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b3b82] tracking-tight flex items-baseline gap-2">
            Shopping cart <span className="text-[#0b3b82]/70 text-lg font-semibold">({totalItemsCount})</span>
          </h1>
        </div>

        {/* Main Grid: Products Table & Cart Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Products List & Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Table Container */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
              {/* Header Row */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Product Rows */}
              {cart.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-[#0b3b82]" />
                  <p className="text-base font-semibold text-slate-600">Your shopping cart is empty</p>
                  <Link href="/" className="inline-block text-xs font-bold bg-[#0b3b82] text-white px-5 py-2.5 rounded-full hover:bg-[#b30047] transition">
                    Explore Products
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center transition hover:bg-slate-50/30">
                  
                  {/* Product Details (Col 6) */}
                  <div className="sm:col-span-6 flex items-center gap-4">
                    <button 
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 font-bold text-lg px-1 transition"
                      title="Remove product"
                    >
                      ×
                    </button>

                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg shrink-0 relative overflow-hidden flex items-center justify-center p-1">
                      <Image 
                        src={item.mainImage} 
                        alt={item.name} 
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>

                    <Link href={`/product/${item.id}`} className="font-semibold text-slate-800 text-sm hover:text-[#0b3b82] transition line-clamp-2">
                      {item.name}
                    </Link>
                  </div>

                  {/* Price (Col 2) */}
                  <div className="sm:col-span-2 text-left sm:text-center text-sm font-semibold text-slate-700">
                    <span className="sm:hidden text-xs text-slate-400 font-normal mr-2">Price:</span>
                    ৳{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>

                  {/* Quantity (Col 2) */}
                  <div className="sm:col-span-2 flex justify-start sm:justify-center">
                    <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-100/70 px-2 py-1">
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full text-slate-500 hover:bg-white hover:text-slate-800 flex items-center justify-center text-xs transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full text-slate-500 hover:bg-white hover:text-slate-800 flex items-center justify-center text-xs transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal (Col 2) */}
                  <div className="sm:col-span-2 text-left sm:text-right font-bold text-sm text-[#0b3b82]">
                    <span className="sm:hidden text-xs text-slate-400 font-normal mr-2">Subtotal:</span>
                    ৳{(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>

                </div>
              )))}
            </div>

            {/* Bottom Action Bar: Coupon & Clear Cart */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              {/* Left: Coupon Code Input Form */}
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-full px-5 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30 w-full sm:w-56"
                />
                <button 
                  type="submit"
                  className="bg-[#0b3b82] hover:bg-[#082a5e] text-white font-bold text-xs px-6 py-3 rounded-full transition shadow-md whitespace-nowrap"
                >
                  Apply coupon
                </button>
              </form>

              {/* Right: Clear All & Update Cart */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button 
                  type="button"
                  onClick={clearCart}
                  className="bg-[#0b3b82] hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-full transition shadow-md"
                >
                  Clear All
                </button>
                <button 
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs px-6 py-3 rounded-full transition"
                >
                  Update cart
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Cart Totals Summary Box */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#0b3b82] pb-3 border-b border-slate-100">
              Cart totals
            </h2>

            <div className="space-y-4 text-sm">
              {/* Subtotal */}
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>Subtotal</span>
                <span className="text-[#0b3b82] font-extrabold text-base">
                  ৳{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Shipment */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Shipment</span>
                  <span className="text-slate-800">Flat rate: ৳{flatRateShipment.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400 text-right">
                  Shipping to Dhaka.<br />
                  <button type="button" className="text-[#0b3b82] underline font-medium hover:text-[#ff8c00]">
                    Change address
                  </button>
                </div>
              </div>

              {/* Coupon Discount if applied */}
              {couponApplied && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100">
                  <span>Discount (SHOPIA10)</span>
                  <span>-৳{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Total */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-lg font-black text-[#0b3b82]">
                <span>Total</span>
                <span className="text-[#0b3b82] text-xl">
                  ৳{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <Link 
                href="/checkout" 
                className="w-full bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-sm py-3.5 px-4 rounded-full shadow-lg hover:shadow-xl transition-all text-center block"
              >
                Proceed to checkout
              </Link>
              
              <Link 
                href="/" 
                className="w-full text-center block text-xs font-bold text-[#0b3b82] hover:underline pt-1"
              >
                Continue To Shopping
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Feature Badges matching user screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs divide-y md:divide-y-0 md:divide-x divide-slate-100 text-slate-700 text-xs font-bold py-4">
          <div className="flex items-center justify-center gap-3 py-2 px-4">
            <ShieldCheck className="w-5 h-5 text-[#0b3b82]" />
            <span>100% Money back</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-2 px-4">
            <Truck className="w-5 h-5 text-[#0b3b82]" />
            <span>Non-contact shipping</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-2 px-4">
            <RefreshCw className="w-5 h-5 text-[#0b3b82]" />
            <span>Fast delivery</span>
          </div>
        </div>

      </div>
    </div>
  );
}

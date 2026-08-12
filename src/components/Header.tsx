"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, Truck, X, ChevronDown, ChevronRight, Plus, Minus, Menu, Phone } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import productsData from "@/data/products.json";

type SubCategory = {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category?: { id: number; name: string; slug: string };
};

type Category = {
  id: number;
  name: string;
  slug: string;
  subCategories?: SubCategory[];
};

export function Header() {
  const [showTopNotice, setShowTopNotice] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<number | null>(null);
  const { wishlist, cart, user, updateQuantity, removeFromCart, setQuickViewProduct } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWishlistCount = wishlist.length;

  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Fetch dynamic categories + sub-categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/categories?all=1`);
        if (!res.ok) return;
        const json = await res.json();
        const catsData = json.data || json;
        if (Array.isArray(catsData)) {
          const mapped = catsData.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subCategories: (cat.sub_categories || []).map((sub: any) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              category_id: cat.id,
            })),
          }));
          setCategories(mapped);
        }
      } catch {
        // Silently fail if API is starting up
      }
    };

    const loadProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/products?per_page=50`);
        if (!res.ok) return;
        const json = await res.json();
        const prods = json.data?.data || json.data || [];
        if (Array.isArray(prods)) {
          setAllProducts(prods);
        }
      } catch {
        // Fallback to static data
        setAllProducts(productsData);
      }
    };

    loadCategories();
    loadProducts();
  }, []);

  const searchSource = allProducts.length > 0 ? allProducts : productsData;
  const searchResults = searchQuery.trim()
    ? searchSource.filter((p) =>
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof p.category === "string" ? p.category : p.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <header className="w-full bg-white font-sans border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* 1. Top Announcement Bar */}
      {showTopNotice && (
        <div className="bg-[#0b3b82] text-amber-300 text-xs py-2 px-4 flex items-center justify-between text-center relative transition-all">
          <div className="w-full text-center">
            <span>Fastest delivery across Bangladesh! Free delivery on orders over ৳3,000</span>
          </div>
          <button
            onClick={() => setShowTopNotice(false)}
            className="text-white/80 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Middle Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Hamburger Toggle + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-[#0b3b82] transition rounded-lg border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1 group shrink-0">
            <div className="flex items-center">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter text-[#b30047]">
                S<span className="text-[#e60000]">HOPIA</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search Input with Instant Dropdown Results (Desktop / Tablet) */}
        <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products (e.g. Maca, Chia, VWash...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-6 pr-12 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30 transition-all placeholder:text-slate-400"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-[#0b3b82] transition-colors">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {searchQuery.trim() !== "" && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-200">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No products found matching &quot;<span className="font-semibold text-slate-700">{searchQuery}</span>&quot;
                </div>
              ) : (
                searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setQuickViewProduct(prod);
                      setSearchQuery("");
                    }}
                    className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-lg relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={prod.mainImage}
                        alt={prod.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate hover:text-[#0b3b82]">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{prod.category}</p>
                    </div>
                    <div className="text-sm font-black text-[#ff8c00] shrink-0">
                      ৳{typeof prod.price === "number" ? prod.price.toFixed(2) : prod.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Order Tracking Icon */}
          <Link href="/track-order" className="text-slate-700 hover:text-[#0b3b82] transition flex items-center gap-1 text-xs font-bold" title="Track Your Order">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-[#0b3b82]" />
            <span className="hidden lg:inline">Track Order</span>
          </Link>

          {/* User Icon / Profile Badge */}
          <Link href="/account" className="text-slate-700 hover:text-[#b30047] transition flex items-center gap-1.5" title={user ? `Logged in as ${user.name}` : "Sign In / Register"}>
            {user ? (
              <span className="w-7 h-7 rounded-full bg-[#0b3b82] text-white font-bold text-xs flex items-center justify-center border border-slate-200">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-6 h-6 stroke-[1.8]" />
            )}
          </Link>

          {/* Wishlist Icon with Badge */}
          <Link href="/wishlist" className="relative text-[#0b3b82] hover:text-[#b30047] transition">
            <Heart className="w-6 h-6 stroke-[1.8]" />
            {totalWishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff8c00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                {totalWishlistCount}
              </span>
            )}
            {totalWishlistCount === 0 && (
              <span className="absolute -top-2 -right-2 bg-[#0b3b82] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            )}
          </Link>

          {/* Cart Icon with Badge & Hover Dropdown Window */}
          <div className="relative group py-2">
            <Link href="/cart" className="relative text-amber-500 hover:text-[#b30047] transition flex items-center">
              <ShoppingCart className="w-6 h-6 stroke-[1.8]" />
              <span className="absolute -top-2 -right-2 bg-[#0b3b82] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            </Link>

            {/* Hover Cart Popup Window */}
            <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 w-80 sm:w-96">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 space-y-2">
                    <ShoppingCart className="w-10 h-10 mx-auto opacity-30" />
                    <p className="text-sm font-semibold">Your cart is currently empty</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3 relative">
                          {/* Item Thumbnail */}
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl relative shrink-0 overflow-hidden flex items-center justify-center p-1">
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0 pr-6 space-y-1.5">
                            <h4 className="text-xs font-semibold text-[#0b3b82] truncate leading-tight">
                              {item.name}
                            </h4>

                            {/* Quantity Controls */}
                            <div className="inline-flex items-center border border-slate-200 rounded-full bg-slate-100/80 px-2 py-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, -1);
                                }}
                                className="w-5 h-5 rounded-full text-slate-600 hover:bg-white flex items-center justify-center text-xs transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(item.id, 1);
                                }}
                                className="w-5 h-5 rounded-full text-slate-600 hover:bg-white flex items-center justify-center text-xs transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-sm font-bold text-[#0b3b82]">
                              ৳{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          {/* Remove Item Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.id);
                            }}
                            className="absolute top-2 right-0 text-slate-400 hover:text-slate-700 text-sm font-bold p-1 transition"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal Section */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-sm">
                      <span className="text-[#0b3b82]">Subtotal :</span>
                      <span className="text-[#0b3b82] text-base">
                        ৳{cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5 pt-1">
                      <Link
                        href="/cart"
                        className="w-full border-2 border-[#0b3b82] text-[#0b3b82] hover:bg-[#0b3b82] hover:text-white font-bold text-xs py-2.5 rounded-full transition-all duration-200 text-center block"
                      >
                        View Cart
                      </Link>

                      <Link
                        href="/checkout"
                        className="w-full bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs py-2.5 rounded-full transition-all duration-200 shadow-md text-center block"
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Row (Always visible on mobile & small screens) */}
      <div className="md:hidden px-4 pb-3 pt-1 bg-white border-t border-slate-100 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products (e.g. Maca, Chia, VWash...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-4 pr-10 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30 transition"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700">
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Mobile Instant Search Results Dropdown */}
        {searchQuery.trim() !== "" && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">No products found matching &quot;{searchQuery}&quot;</div>
            ) : (
              searchResults.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setQuickViewProduct(prod);
                    setSearchQuery("");
                  }}
                  className="p-2.5 flex items-center gap-3 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="w-9 h-9 relative shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 p-0.5">
                    <Image src={prod.mainImage} alt={prod.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400">{prod.category}</p>
                  </div>
                  <div className="text-xs font-black text-[#ff8c00] shrink-0">৳{prod.price}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Desktop Category Navigation Bar */}
      <div className="hidden lg:block border-t border-slate-100 bg-white text-[#0b3b82] font-semibold text-xs lg:text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2.5">
          <nav className="flex items-center flex-wrap gap-x-5 xl:gap-x-7 gap-y-1">
            {/* Home — always first */}
            <Link href="/" className="font-bold text-[#0b3b82] hover:text-[#b30047] transition whitespace-nowrap">
              Home
            </Link>
            {/* Dynamic Categories — sorted A→Z */}
            {categories.map(cat => (
              <div key={cat.id} className="relative group">
                <Link
                  href={`/all-products?category=${cat.slug}`}
                  className="flex items-center gap-1 hover:text-[#b30047] transition whitespace-nowrap"
                >
                  {cat.name}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                  )}
                </Link>

                {/* Sub-category dropdown on hover */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[180px]">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-150">
                      {cat.subCategories.map(sub => (
                        <Link
                          key={sub.id}
                          href={`/all-products?sub_category=${sub.slug}`}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-[#0b3b82] hover:bg-slate-50 transition whitespace-nowrap"
                        >
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. Mobile Side Navigation Drawer (Toggled by Hamburger button) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div className="p-5 space-y-6 overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-2xl font-black italic text-[#b30047]">
                  S<span className="text-[#e60000]">HOPIA</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full border border-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Nav Links — Dynamic Categories Only */}
              <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-700">
                {categories.map(cat => (
                  <div key={cat.id}>
                    {/* Category with sub-categories: show as expandable accordion */}
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.id ? null : cat.id)}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#0b3b82] transition flex items-center justify-between text-left"
                        >
                          <span>{cat.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMobileCategory === cat.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedMobileCategory === cat.id && (
                          <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l-2 border-[#0b3b82]/20 pl-3">
                            <Link
                              href={`/all-products?category=${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-2 py-1.5 rounded-lg text-xs font-semibold text-[#0b3b82] hover:bg-slate-50 transition"
                            >
                              All {cat.name}
                            </Link>
                            {cat.subCategories.map(sub => (
                              <Link
                                key={sub.id}
                                href={`/all-products?sub_category=${sub.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-[#0b3b82] hover:bg-slate-50 transition"
                              >
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Category without sub-categories: direct link */
                      <Link
                        href={`/all-products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#0b3b82] transition"
                      >
                        {cat.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Mobile Drawer Footer Hotline */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-2">
              <p className="text-xs text-slate-400 font-bold">Order Hotline Support</p>
              <a 
                href="tel:01681135030"
                className="bg-[#0b3b82] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> 01681-135030
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Heart,
  Eye,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  LayoutGrid,
  Loader2,
  PackageX,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: boolean | number;
}

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  original_price?: string | number | null;
  main_image?: string | null;
  category?: { id: number; name: string } | null;
  category_id?: number;
  rating?: number;
  reviews_count?: number;
  discount?: number | null;
  is_featured?: boolean | number;
  is_bestseller?: boolean | number;
  is_new?: boolean | number;
  status?: string;
}

interface NormalizedProduct {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  mainImage: string;
  category: string;
  categoryId: number | null;
  rating: number;
  reviewsCount: number;
  discountPercentage?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  status?: string;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const PLACEHOLDER = "https://placehold.co/300x300/f1f5f9/94a3b8?text=No+Image";

function normalize(p: any): NormalizedProduct {
  const rawPrice = parseFloat(String(p.price || 0)) || 0;
  const rawSalePrice = p.sale_price !== null && p.sale_price !== undefined ? parseFloat(String(p.sale_price)) : null;

  let activePrice = rawPrice;
  let originalPrice: number | undefined = undefined;

  if (rawSalePrice !== null && rawSalePrice > 0 && rawSalePrice < rawPrice) {
    activePrice = rawSalePrice;
    originalPrice = rawPrice;
  } else if (p.originalPrice || p.original_price) {
    originalPrice = parseFloat(String(p.originalPrice || p.original_price));
  }

  let discountPercentage = p.discount ? parseFloat(String(p.discount)) : undefined;
  if (!discountPercentage && originalPrice && originalPrice > activePrice) {
    discountPercentage = Math.round(((originalPrice - activePrice) / originalPrice) * 100);
  }

  return {
    id: p.id,
    name: p.name || "Product",
    slug: p.slug || String(p.id),
    price: activePrice,
    originalPrice: originalPrice,
    mainImage: p.image || p.main_image || p.mainImage || (Array.isArray(p.images) && p.images[0]) || PLACEHOLDER,
    category: typeof p.category === "string" ? p.category : (p.category?.name || "General"),
    categoryId: p.category_id || p.category?.id || null,
    rating: p.rating ?? 4.8,
    reviewsCount: p.reviews_count ?? 12,
    discountPercentage,
    isFeatured: Boolean(p.featured || p.is_featured),
    isBestSeller: Boolean(p.best_seller || p.is_bestseller),
    isNew: Boolean(p.new_arrival || p.is_new),
    status: String(p.status ?? true),
  };
}

// ─── Content Component ───────────────────────────────────────────────────────
function AllProductsContent() {
  const { addToCart, addToWishlist, isInWishlist, setQuickViewProduct } = useShop();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter / sort state
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Fetch categories from DB
  useEffect(() => {
    setLoadingCats(true);
    fetch(`${API_BASE}/categories?all=1`)
      .then((r) => r.json())
      .then((res: any) => {
        const catList = res.data || (Array.isArray(res) ? res : []);
        setCategories(catList);
        if (urlCategory) {
          const matched = catList.find((c: any) => c.slug === urlCategory || String(c.id) === urlCategory);
          if (matched) {
            setSelectedCategoryId(matched.id);
          }
        }
      })
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoadingCats(false));
  }, [urlCategory]);

  // Fetch all products
  useEffect(() => {
    setLoadingProds(true);
    fetch(`${API_BASE}/products?per_page=50`)
      .then((r) => r.json())
      .then((res: any) => {
        const prods = res.data?.data || res.data || (Array.isArray(res) ? res : []);
        const list = prods.map(normalize);
        setProducts(list);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoadingProds(false));
  }, []);

  // Filtered + sorted product list
  const displayed = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategoryId !== null) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedCategoryId, sortBy, searchQuery]);

  const isLoading = loadingCats || loadingProds;

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#1a4fa0] to-[#b30047] text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffcc00 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4" /> Full Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide leading-tight">
            All Products
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-xs sm:text-sm leading-relaxed">
            Browse our complete range of organic foods, beauty products, and health
            supplements — all in one place.
          </p>

          {/* Inline search */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-5 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">

        {/* ── Filter & Sort Bar ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#0b3b82] shrink-0" />

            {/* "All" pill */}
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategoryId === null
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              All
            </button>

            {loadingCats ? (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading categories…
              </span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId(
                      selectedCategoryId === cat.id ? null : cat.id
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategoryId === cat.id
                      ? "bg-[#0b3b82] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
            >
              <option value="default">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* ── Results count ────────────────────────────────────────── */}
        {!isLoading && !error && (
          <p className="text-xs text-slate-500 font-semibold">
            Showing{" "}
            <span className="text-[#0b3b82] font-black">{displayed.length}</span>{" "}
            product{displayed.length !== 1 ? "s" : ""}
            {selectedCategoryId !== null &&
              ` in "${categories.find((c) => c.id === selectedCategoryId)?.name}"`}
            {searchQuery.trim() && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* ── Loading skeleton ─────────────────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3"
              >
                <div className="w-full h-36 bg-slate-100 rounded-xl" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────── */}
        {!isLoading && error && (
          <div className="text-center py-20 space-y-3">
            <PackageX className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-slate-500 text-sm font-semibold">{error}</p>
            <p className="text-slate-400 text-xs">
              Make sure the backend server is running at{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                {API_BASE}
              </code>
            </p>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────── */}
        {!isLoading && !error && displayed.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <PackageX className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-slate-500 text-sm font-semibold">
              No products found
              {selectedCategoryId !== null &&
                ` in "${categories.find((c) => c.id === selectedCategoryId)?.name}"`}
              {searchQuery.trim() && ` matching "${searchQuery}"`}.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                setSearchQuery("");
              }}
              className="text-xs font-bold text-[#0b3b82] underline hover:text-[#b30047] transition"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ── Product Grid ─────────────────────────────────────────── */}
        {!isLoading && !error && displayed.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {displayed.map((prod, idx) => {
              const cols = 5; // desktop columns
              const isLastInRow = (idx + 1) % cols === 0;
              const isInLastRow = idx >= displayed.length - (displayed.length % cols || cols);
              return (
                <div
                  key={prod.id}
                  className={`p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white relative group/card overflow-hidden
                    ${!isLastInRow ? "border-r border-slate-100" : ""}
                    ${!isInLastRow ? "border-b border-slate-100" : ""}
                  `}
                >
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {prod.discountPercentage && prod.discountPercentage > 0 && (
                      <span className="bg-[#ff8c00] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        -{Math.round(prod.discountPercentage)}%
                      </span>
                    )}
                    {prod.isNew && (
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        NEW
                      </span>
                    )}
                    {prod.isBestSeller && (
                      <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        HOT
                      </span>
                    )}
                  </div>

                  <div>
                    {/* Image */}
                    <div className="w-full h-40 bg-white rounded-xl flex items-center justify-center overflow-hidden relative mb-3">
                      <Link
                        href={`/product/${prod.slug || prod.id}`}
                        className="relative w-full h-full block"
                      >
                        <Image
                          src={prod.mainImage}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-contain p-2 group-hover/card:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Hover Action Icons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-3 group-hover/card:translate-x-0">
                        <button
                          type="button"
                          onClick={() => addToWishlist(prod)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors ${isInWishlist(prod.id)
                              ? "bg-rose-500 text-white"
                              : "bg-white text-slate-600 hover:bg-[#b30047] hover:text-white"
                            }`}
                          title="Add to Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(prod)}
                          className="w-7 h-7 rounded-full bg-white text-slate-600 hover:bg-[#0b3b82] hover:text-white flex items-center justify-center shadow-md transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Category label */}
                    <p className="text-[10px] font-semibold text-[#b30047] mb-1 uppercase tracking-wide truncate">
                      {prod.category}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(prod.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                            }`}
                        />
                      ))}
                      {prod.reviewsCount > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 ml-1">
                          ({prod.reviewsCount})
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <Link href={`/product/${prod.slug || prod.id}`}>
                      <h3 className="font-bold text-slate-800 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-snug mb-2 min-h-[32px]">
                        {prod.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-black text-[#0b3b82] block">
                        ৳
                        {prod.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ৳
                          {prod.originalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(prod, 1)}
                      className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <AllProductsContent />
    </Suspense>
  );
}

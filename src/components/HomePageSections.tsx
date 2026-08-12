"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import slidersData from "@/data/sliders.json";
import productsData from "@/data/products.json";
import { 
  Zap, ChevronLeft, ChevronRight, Star, Heart, ShoppingBag, Flame, 
  ChevronRight as ChevronRightIcon
} from "lucide-react";

import { getBanners } from "@/lib/api";

export function HeroSlider() {
  const [slides, setSlides] = useState<any[]>(slidersData);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadDynamicBanners() {
      try {
        const res = await getBanners();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const activeBanners = res.data
            .filter((b) => b.is_active !== false)
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

          if (activeBanners.length > 0) {
            const formatted = activeBanners.map((b) => {
              let t1 = b.title_line1 || "";
              let t2 = b.title_line2 || "";
              if (!t1 && !t2 && b.title) {
                const words = b.title.split(" ");
                t1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
                t2 = words.slice(Math.ceil(words.length / 2)).join(" ");
              }

              return {
                id: b.id,
                tagline: b.badge || b.tagline || "100% PURE & NATURAL",
                titleLine1: t1 || b.title || "EXCLUSIVE",
                titleLine2: t2 || "",
                discountText: b.subtitle || "",
                linkUrl: b.cta_link || "/",
                ctaText: b.cta_text || "SHOP NOW",
                bgColor: b.bg_color || "#dfcebe",
                rightBgColor: b.right_bg_color || b.bg_color || "#dfcebe",
                leftImage: b.left_image && b.left_image.trim() !== "" ? b.left_image : "/hero_left_card.png",
                rightImage: b.image && b.image.trim() !== "" ? b.image : "/hero_honey.png",
              };
            });
            setSlides(formatted);
          }
        }
      } catch (err) {
        console.error("Failed to load banners:", err);
      }
    }

    loadDynamicBanners();
  }, []);

  const totalSlides = slides.length;

  // Auto-advance both panels together every 4.5s when not paused
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % totalSlides);
      setRightIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  // LEFT arrow: only changes the left promo panel
  const handleLeftPrev = () => {
    setLeftIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // RIGHT arrow: only changes the right product image panel
  const handleRightNext = () => {
    setRightIndex((prev) => (prev + 1) % totalSlides);
  };

  const leftSlide = slides[leftIndex] || slides[0] || {};
  const rightSlide = slides[rightIndex] || slides[0] || {};
  const leftBgColor = leftSlide.bgColor || "#dfcebe";
  const rightBgColor = rightSlide.rightBgColor || rightSlide.bgColor || "#dfcebe";

  return (
    <div 
      className="w-full overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch border-b border-amber-200/50 relative group min-h-[420px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══ LEFT PROMO PANEL — navigated by LEFT arrow ═══ */}
      <div 
        className="w-full md:w-1/2 min-h-[360px] relative overflow-hidden flex items-center justify-center p-6 sm:p-12 text-center transition-colors duration-500"
        style={{ backgroundColor: leftBgColor }}
      >
        {leftSlide.leftImage && (
          <img 
            key={`left-bg-${leftIndex}`}
            src={leftSlide.leftImage} 
            alt="Banner pattern background"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 pointer-events-none"
            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

        {/* Left panel content */}
        <div className="relative z-10 space-y-3 max-w-sm mx-auto">
          {leftSlide.tagline && (
            <span className="text-[#0b3b82] text-xs sm:text-sm font-semibold tracking-widest uppercase block">
              {leftSlide.tagline}
            </span>
          )}
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#b8860b] leading-none uppercase">
            {leftSlide.titleLine1} {leftSlide.titleLine2 && <><br /> {leftSlide.titleLine2}</>}
          </h1>

          {leftSlide.discountText && (
            <p className="text-[#e60000] text-lg sm:text-2xl font-bold tracking-wide pt-1">
              {leftSlide.discountText}
            </p>
          )}

          <div className="pt-3">
            <Link 
              href={leftSlide.linkUrl || "/"} 
              className="inline-block bg-[#0b3b82] hover:bg-[#b30047] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full transition-all shadow-md hover:scale-105"
            >
              {leftSlide.ctaText || "SHOP NOW"}
            </Link>
          </div>
        </div>

        {/* Left dot indicators */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setLeftIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  leftIndex === idx ? "w-6 bg-[#0b3b82]" : "w-2 bg-slate-400/50 hover:bg-slate-600"
                }`}
                title={`Left panel slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ RIGHT PRODUCT IMAGE PANEL — navigated by RIGHT arrow ═══ */}
      <div 
        className="w-full md:w-1/2 min-h-[360px] sm:min-h-[420px] relative overflow-hidden flex items-center justify-center transition-colors duration-500"
        style={{ backgroundColor: rightBgColor }}
      >
        <img 
          key={`right-img-${rightIndex}`}
          src={rightSlide.rightImage || "/hero_honey.png"} 
          alt={rightSlide.titleLine1 || "Product Showcase"}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "/hero_honey.png"; }}
        />

        {/* Right dot indicators */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setRightIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  rightIndex === idx ? "w-6 bg-[#0b3b82]" : "w-2 bg-slate-400/50 hover:bg-slate-600"
                }`}
                title={`Right panel slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══ Navigation Arrows — each controls its own panel ═══ */}
      {totalSlides > 1 && (
        <>
          {/* LEFT arrow → changes ONLY the left promo panel */}
          <button 
            onClick={handleLeftPrev}
            title="Previous promo slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0b3b82] hover:bg-[#b30047] text-white p-3 rounded-full shadow-xl z-20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* RIGHT arrow → changes ONLY the right product panel */}
          <button 
            onClick={handleRightNext}
            title="Next product slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0b3b82] hover:bg-[#b30047] text-white p-3 rounded-full shadow-xl z-20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>
        </>
      )}
    </div>
  );
}

export function CategoryGrid() {
  const categories = [
    { name: "Organic Food", count: "120+ Items", icon: "🌱", color: "bg-emerald-500/10 text-emerald-600" },
    { name: "Beauty", count: "95+ Items", icon: "✨", color: "bg-rose-500/10 text-rose-600" },
    { name: "Food Supplements", count: "340+ Items", icon: "💊", color: "bg-amber-500/10 text-amber-600" },
    { name: "Health", count: "65+ Items", icon: "🩺", color: "bg-blue-500/10 text-blue-600" },
    { name: "Babies Hub", count: "80+ Items", icon: "👶", color: "bg-purple-500/10 text-purple-600" },
    { name: "Pharma Point", count: "210+ Items", icon: "🏥", color: "bg-cyan-500/10 text-cyan-600" },
  ];

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
          <p className="text-xs text-slate-500">Pure, organic & authentic everyday essentials</p>
        </div>
        <Link href="/categories" className="text-sm font-bold text-[#0b3b82] hover:text-[#b30047] flex items-center gap-1">
          See All Categories <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <Link key={idx} href={`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center hover:shadow-xl hover:border-[#0b3b82]/30 transition group cursor-pointer">
            <div className={`w-14 h-14 mx-auto rounded-2xl ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-[#b30047] transition">{cat.name}</h3>
            <span className="text-[11px] text-slate-400">{cat.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 hover:shadow-xl hover:border-[#0b3b82]/20 transition group flex flex-col justify-between relative">
      {/* Badges */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
        {product.discountPercentage && (
          <span className="bg-[#e60000] text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md">
            -{product.discountPercentage}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="bg-[#0b3b82] text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-5 right-5 z-10 bg-white/80 hover:bg-white text-slate-400 hover:text-[#b30047] p-2 rounded-full shadow-md backdrop-blur-md transition">
        <Heart className="w-4 h-4" />
      </button>

      <div>
        {/* Product Image Box */}
        <div className="w-full h-48 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
          <Image 
            src={product.mainImage} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain p-2"
          />
        </div>

        {/* Title & Rating */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-slate-400">({product.reviewsCount})</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-[#b30047] transition leading-snug">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-slate-400 line-through text-xs font-semibold">
            ৳{product.originalPrice}
          </div>
          <div className="text-[#e60000] font-black text-lg">
            ৳{product.price}
          </div>
        </div>
        <button className="bg-[#0b3b82] hover:bg-[#b30047] text-white p-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center">
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function FlashSaleSection() {
  const flashSaleProducts = productsData.filter((p) => p.isFlashSale);

  return (
    <div className="bg-[#0b3b82] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center font-bold shadow-lg">
            <Zap className="w-6 h-6 fill-slate-900" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Flash Sale Offers <span className="text-amber-300 text-xs font-bold bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">Limited Time</span>
            </h2>
            <p className="text-xs text-blue-200">Grab pure & healthy organic offers at discounted prices!</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-blue-200">Ends In:</span>
          <div className="flex items-center gap-1">
            <span className="bg-[#b30047] px-2.5 py-1 rounded-lg text-white">08h</span> :
            <span className="bg-[#b30047] px-2.5 py-1 rounded-lg text-white">42m</span> :
            <span className="bg-[#b30047] px-2.5 py-1 rounded-lg text-white">19s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashSaleProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight, Tag, Search, Sparkles } from "lucide-react";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Organic Food", "Health & Wellness", "Skin Care", "Nutrition"];

  const blogPosts = [
    {
      id: "blog-1",
      slug: "health-benefits-of-organic-maca-powder",
      title: "Health Benefits of Organic Black Maca Powder You Need to Know",
      excerpt: "Discover how organic maca powder boosts energy, enhances stamina, balances hormones, and improves daily vitality naturally.",
      category: "Organic Food",
      author: "Dr. Mostafizur Rahman",
      date: "28 July, 2026",
      readTime: "5 min read",
      image: "/prod_maca.png",
      featured: true
    },
    {
      id: "blog-[#2]",
      slug: "chia-seeds-superfood-guide",
      title: "Why White Chia Seeds are the Ultimate Superfood for Weight Loss",
      excerpt: "Packed with omega-3 fatty acids, fiber, and protein, chia seeds help regulate digestion and maintain healthy body weight.",
      category: "Nutrition",
      author: "Nusrat Jahan",
      date: "22 July, 2026",
      readTime: "4 min read",
      image: "/prod_chia.png",
      featured: false
    },
    {
      id: "blog-3",
      slug: "natural-skin-care-routine-with-vitamin-e",
      title: "How to Build a Glowing Daily Skin Care Routine with Vitamin E & Serums",
      excerpt: "Learn expert dermatologist tips for protecting your skin from pollution, reducing dark spots, and retaining natural moisture.",
      category: "Skin Care",
      author: "Dr. Anika Sadia",
      date: "15 July, 2026",
      readTime: "6 min read",
      image: "/prod_serum.png",
      featured: false
    },
    {
      id: "blog-4",
      slug: "benefits-of-pure-mustard-oil",
      title: "Pure Cold-Pressed Mustard Oil: Traditional Uses & Modern Health Benefits",
      excerpt: "Explore the age-old Bangladeshi traditions of pure mustard oil for cooking, hair conditioning, and body massage.",
      category: "Health & Wellness",
      author: "Kazi Tanvir",
      date: "10 July, 2026",
      readTime: "4 min read",
      image: "/prod_blackseed.png",
      featured: false
    },
    {
      id: "blog-5",
      slug: "raw-honey-vs-processed-honey",
      title: "Raw Sundarban Honey vs Commercial Honey: Spot the Difference",
      excerpt: "Unfiltered Sundarban raw honey preserves natural enzymes and pollen. Learn how to verify authentic pure honey at home.",
      category: "Organic Food",
      author: "Dr. Mostafizur Rahman",
      date: "02 July, 2026",
      readTime: "5 min read",
      image: "/prod_honey.png",
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-12 pb-20">
      
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/30 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" /> Shopia BD Health &amp; Organic Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wide leading-tight">
            Our Official Blog
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-xs sm:text-sm leading-relaxed">
            Expert articles, wellness tips, organic food guides, and healthy lifestyle advice from our specialists.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-2 relative">
            <input
              type="text"
              placeholder="Search blog articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 border border-white/20 rounded-full pl-5 pr-11 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-amber-400/30 shadow-lg placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#0b3b82] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post Hero Card (Shown when filter is "All" and no search query) */}
        {activeCategory === "All" && !searchQuery && (
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            
            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[400px] bg-slate-100 p-6 flex items-center justify-center">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-amber-400 text-slate-900 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Featured Article
              </span>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <span className="bg-[#0b3b82]/10 text-[#0b3b82] px-3 py-1 rounded-full">{featuredPost.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {featuredPost.readTime}</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug hover:text-[#0b3b82] transition">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0b3b82]" /> {featuredPost.author}
                </span>
                <button
                  type="button"
                  className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  Read Full Post <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Blog Post Grid Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900">Latest Articles ({filteredPosts.length})</h3>
            <span className="text-xs text-slate-400">Showing posts for {activeCategory}</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
              <h4 className="font-bold text-slate-800">No articles found</h4>
              <p className="text-xs text-slate-400">Try searching for another topic or select a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4 p-5">
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex items-center justify-center">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#0b3b82] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-[#0b3b82] transition leading-snug">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                    <span className="font-semibold text-slate-600 truncate max-w-[150px]">By {post.author}</span>
                    <span className="font-bold text-[#0b3b82] group-hover:text-[#b30047] transition flex items-center gap-1">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

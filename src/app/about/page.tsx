"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, HeartHandshake, Truck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50,000+" },
    { label: "Organic Products", value: "1,200+" },
    { label: "Districts Covered", value: "64" },
    { label: "Customer Rating", value: "4.9 / 5" },
  ];

  const coreValues = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#0b3b82]" />,
      title: "100% Authentic & Pure",
      description: "Every item in our collection is carefully sourced directly from certified organic farms and global trusted suppliers."
    },
    {
      icon: <Award className="w-8 h-8 text-[#ff8c00]" />,
      title: "Premium Quality Control",
      description: "Strict quality checks ensure that only fresh, high-grade, chemical-free products reach your doorstep."
    },
    {
      icon: <Truck className="w-8 h-8 text-[#0b3b82]" />,
      title: "Nationwide Fast Delivery",
      description: "Reliable & non-contact cash-on-delivery across all 64 districts in Bangladesh with express processing."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#ff8c00]" />,
      title: "Customer-First Support",
      description: "Dedicated customer service team available 7 days a week to answer your questions and assist your health journey."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-16 pb-20">
      
      {/* 1. Hero Header Banner */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Welcome to ShopiaBD
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-wide leading-tight">
            Your Trusted Partner for <br className="hidden sm:inline" />
            <span className="text-amber-300 tracking-wide">Pure, Organic &amp; Authentic Living</span>
          </h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed tracking-wide pt-2">
            Empowering healthy lifestyles across Bangladesh by bringing 100% natural organic food, premium skincare, and healthcare supplements directly to your home.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-20">
        
        {/* 2. Story Section with Image Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Grid Box (Col 6) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image 
                src="/prod_honey.png" 
                alt="Shopia Story Showcase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8 hover:scale-105 transition duration-500"
                priority
              />
            </div>
            
            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0b3b82] text-white font-black text-xl flex items-center justify-center">
                #1
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Authentic E-Commerce</h4>
                <p className="text-xs text-slate-500">In Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Story Text Box (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[#ff8c00] font-bold text-xs uppercase tracking-widest block">
                OUR STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b3b82] tracking-tight leading-snug">
                Bringing Pure &amp; Natural Wellness to Every Home
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Founded with a clear vision, <strong className="text-slate-800">ShopiaBD</strong> set out to solve the challenge of finding genuine, unadulterated organic products in Bangladesh. We believe that good health starts with authentic food, uncompromised skincare, and pure supplements.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              From pure Sundarban wild honey, raw organic chia seeds, and premium maca superfood to dermatologist-approved skincare formulations, every item in our store is selected with utmost care for purity and safety.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Directly Sourced Organic Food",
                "100% Unadulterated Honey",
                "Chemical-Free Skincare",
                "Fast Nationwide COD"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e07b00] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </section>

        {/* 3. Stat Counter Bar */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className={`${idx !== 0 ? "pt-6 sm:pt-0" : ""} space-y-1`}>
                <div className="text-3xl sm:text-5xl font-black text-[#0b3b82] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Core Values Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[#ff8c00] font-bold text-xs uppercase tracking-widest block">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl font-extrabold text-[#0b3b82] tracking-tight">
              Our Core Promises to You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Built on transparency, authenticity, and dedication to your health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-[#0b3b82]/30 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                  {val.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Contact CTA Box */}
        <section className="bg-[#0b3b82] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Have Questions or Need Recommendations?
            </h2>
            <p className="text-blue-100 text-sm">
              Our dedicated support team is here to assist you with order inquiries, product guidance, and delivery updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <a 
              href="tel:01681135030" 
              className="bg-[#ff8c00] hover:bg-[#e07b00] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg transition"
            >
              Call Hotline: 01681-135030
            </a>
            <a 
              href="mailto:info@shopiabd.com" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-8 py-3.5 rounded-full transition"
            >
              Email Us
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

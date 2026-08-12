"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b3b82] text-blue-100 font-sans border-t border-[#092e66] pt-12 pb-8 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main 5-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-blue-900/60">
          
          {/* Col 1: Brand & Address (Col 3) */}
          <div className="md:col-span-3 space-y-4 pr-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black italic tracking-tighter text-[#b30047]">
                S<span className="text-[#e60000]">HOPIA</span>
              </span>
            </Link>

            <div className="space-y-1 text-blue-100/80 text-xs leading-relaxed">
              <p>41/1, Sher-E-Bangla Rd,</p>
              <p>Mohammadpur, Dhaka 1207</p>
              <button type="button" className="text-amber-300 underline hover:text-white transition font-medium">
                Show on map
              </button>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 text-blue-200 pt-2">
              <a href="#" className="hover:text-amber-300 transition p-1" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="hover:text-amber-300 transition p-1" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="hover:text-amber-300 transition p-1" aria-label="Youtube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="#" className="hover:text-amber-300 transition p-1 font-bold text-sm" aria-label="Pinterest">
                P
              </a>
              <a href="#" className="hover:text-amber-300 transition p-1" aria-label="Linkedin">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.239-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Need Help Hotline & Hours (Col 4 with left border) */}
          <div className="md:col-span-4 md:border-l border-blue-900/60 md:pl-8 space-y-4">
            <h3 className="font-bold text-white text-sm">Need help</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xl font-extrabold tracking-tight">01681-135030</span>
              </div>

              <div className="text-[11px] text-blue-200/70 space-y-0.5 pl-7">
                <p>Saturday- Thursday: 9:00am-10:00pm</p>
                <p>Friday: 15:00pm – 11:00pm</p>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/60 flex items-center gap-2 text-blue-200/80 text-xs">
              <Mail className="w-4 h-4 text-amber-400" />
              <a href="mailto:info@shopiabd.com" className="hover:text-amber-300 transition">
                info@shopiabd.com
              </a>
            </div>
          </div>

          {/* Col 3: Information Links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm">Information</h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li><Link href="/about" className="hover:text-amber-300 transition">About us</Link></li>
              <li><Link href="/blog" className="hover:text-amber-300 transition">Blog &amp; Journal</Link></li>
              <li><Link href="/faq" className="hover:text-amber-300 transition">FAQ &amp; Support</Link></li>
              <li><Link href="/delivery" className="hover:text-amber-300 transition">Delivery information</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-300 transition">Privacy Policy</Link></li>
              <li><Link href="/sales" className="hover:text-amber-300 transition">Sales</Link></li>
              <li><Link href="/terms" className="hover:text-amber-300 transition">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Col 4: Account Links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm">Account</h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li><Link href="/account" className="hover:text-amber-300 transition">My account</Link></li>
              <li><Link href="/dashboard?tab=orders" className="hover:text-amber-300 transition">My orders</Link></li>
              <li><Link href="/returns" className="hover:text-amber-300 transition">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-amber-300 transition">Shipping</Link></li>
              <li><Link href="/wishlist" className="hover:text-amber-300 transition">Wishlist</Link></li>
            </ul>
          </div>

          {/* Col 5: Store Links */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="font-bold text-white text-sm">Store</h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li><Link href="/bestsellers" className="hover:text-amber-300 transition">Bestsellers</Link></li>
              <li><Link href="/discount" className="hover:text-amber-300 transition">Discount</Link></li>
              <li><Link href="/latest" className="hover:text-amber-300 transition">Latest products</Link></li>
              <li><Link href="/sale" className="hover:text-amber-300 transition">Sale</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Logos */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
          <p>
            Copyright © 2026 Shopia. All Rights Reserved
          </p>

          {/* Payment Method Badges (bKash, Rocket, Nagad, Visa, Mastercard, Amex) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] uppercase border border-white/20">
              bKash
            </span>
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] uppercase border border-white/20">
              Rocket
            </span>
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] uppercase border border-white/20">
              Nagad
            </span>
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] italic uppercase border border-white/20">
              VISA
            </span>
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] uppercase border border-white/20">
              MasterCard
            </span>
            <span className="px-2 py-1 bg-white/10 text-white font-black rounded text-[10px] uppercase border border-white/20">
              AMEX
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { getFooterSettings, ApiFooterSettings } from "@/lib/api";

const DEFAULT_FOOTER: ApiFooterSettings = {
  store_name: "Shopia",
  logo_image: null,
  address: "41/1, Sher-E-Bangla Rd,\nMohammadpur, Dhaka 1207",
  map_url: "https://maps.google.com/?q=41/1+Sher-E-Bangla+Rd+Mohammadpur+Dhaka",
  contact_phone: "01681-135030",
  contact_email: "info@shopiabd.com",
  working_hours_1: "Saturday- Thursday: 9:00am- 10:00pm",
  working_hours_2: "Friday: 15:00pm – 11:00pm",
  facebook_url: "https://facebook.com/shopiabd",
  instagram_url: "https://instagram.com/shopiabd",
  youtube_url: "https://youtube.com/@shopiabd",
  pinterest_url: "https://pinterest.com/shopiabd",
  linkedin_url: "https://linkedin.com/company/shopiabd",
  twitter_url: "",
  tiktok_url: "",
  column_1_title: "Information",
  column_1_links: [
    { label: "About us", url: "/about" },
    { label: "Blog & Journal", url: "/blog" },
    { label: "FAQ & Support", url: "/faq" },
    { label: "Delivery information", url: "/delivery" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Sales", url: "/sales" },
    { label: "Terms & Conditions", url: "/terms" },
  ],
  column_2_title: "Account",
  column_2_links: [
    { label: "My account", url: "/account" },
    { label: "My orders", url: "/dashboard?tab=orders" },
    { label: "Returns", url: "/returns" },
    { label: "Shipping", url: "/shipping" },
    { label: "Wishlist", url: "/wishlist" },
  ],
  column_3_title: "Store",
  column_3_links: [
    { label: "Bestsellers", url: "/bestsellers" },
    { label: "Discount", url: "/discount" },
    { label: "Latest products", url: "/latest" },
    { label: "Sale", url: "/sale" },
  ],
  copyright_text: "Copyright © 2026 Shopia. All Rights Reserved",
  payment_methods: ["BKASH", "ROCKET", "NAGAD", "VISA", "MASTERCARD", "AMEX"],
};

export function Footer() {
  const [footer, setFooter] = useState<ApiFooterSettings>(DEFAULT_FOOTER);

  useEffect(() => {
    let isMounted = true;
    const fetchFooter = async () => {
      try {
        const res = await getFooterSettings();
        if (isMounted && res && res.data) {
          setFooter((prev) => ({
            ...prev,
            ...res.data,
            column_1_links: (res.data.column_1_links && res.data.column_1_links.length > 0) ? res.data.column_1_links : prev.column_1_links,
            column_2_links: (res.data.column_2_links && res.data.column_2_links.length > 0) ? res.data.column_2_links : prev.column_2_links,
            column_3_links: (res.data.column_3_links && res.data.column_3_links.length > 0) ? res.data.column_3_links : prev.column_3_links,
            payment_methods: (res.data.payment_methods && res.data.payment_methods.length > 0) ? res.data.payment_methods : prev.payment_methods,
          }));
        }
      } catch {
        // Silently fall back to default footer
      }
    };

    fetchFooter();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-[#0b3b82] text-blue-100 font-sans border-t border-[#092e66] pt-10 sm:pt-12 pb-8 text-xs sm:text-sm selection:bg-amber-400 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid: Responsive 1-col (Mobile) -> 12-col Grid (Tablet & Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-blue-900/60">

          {/* Col 1: Brand Logo, Address & Socials (Mobile: full, Tablet: 6 cols, Desktop: 3 cols) */}
          <div className="md:col-span-6 lg:col-span-3 space-y-4 pr-0 md:pr-4">

            {/* Logo: Image if uploaded, otherwise stylized SHOPIA brand */}
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              {footer.logo_image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={footer.logo_image}
                  alt={footer.store_name || "Shopia"}
                  className="max-h-12 max-w-[200px] object-contain"
                />
              ) : (
                <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-[#b30047] drop-shadow-sm">
                  S<span className="text-[#e60000]">HOPIA</span>
                </span>
              )}
            </Link>

            {/* Address */}
            <div className="space-y-1 text-blue-100/80 text-xs leading-relaxed">
              {footer.address ? (
                footer.address.split("\n").map((line, i) => <p key={i}>{line}</p>)
              ) : (
                <>
                  <p>41/1, Sher-E-Bangla Rd,</p>
                  <p>Mohammadpur, Dhaka 1207</p>
                </>
              )}

              {footer.map_url && (
                <div className="pt-1">
                  <a
                    href={footer.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-300 underline hover:text-white transition font-medium text-xs"
                  >
                    <span>Show on map</span>
                  </a>
                </div>
              )}
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 text-blue-200 pt-2 flex-wrap">
              {footer.facebook_url && (
                <a
                  href={footer.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:scale-110 transition-all p-1"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {footer.instagram_url && (
                <a
                  href={footer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:scale-110 transition-all p-1"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {footer.youtube_url && (
                <a
                  href={footer.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:scale-110 transition-all p-1"
                  aria-label="Youtube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              )}

              {footer.pinterest_url && (
                <a
                  href={footer.pinterest_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:scale-110 transition-all p-1 font-bold text-sm leading-none"
                  aria-label="Pinterest"
                >
                  P
                </a>
              )}

              {footer.linkedin_url && (
                <a
                  href={footer.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:scale-110 transition-all p-1"
                  aria-label="Linkedin"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.239-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Need Help Hotline & Hours (Mobile: full, Tablet: 6 cols, Desktop: 3 cols) */}
          <div className="md:col-span-6 lg:col-span-3 md:border-l border-blue-900/60 md:pl-6 lg:pl-8 space-y-4">
            <h3 className="font-bold text-white text-sm tracking-wide">Need help</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-white">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <a
                  href={`tel:${(footer.contact_phone || "01681135030").replace(/[^0-9+]/g, "")}`}
                  className="text-lg sm:text-xl font-extrabold tracking-tight hover:text-amber-300 transition"
                >
                  {footer.contact_phone || "01681-135030"}
                </a>
              </div>

              <div className="text-[11px] text-blue-200/70 space-y-0.5 pl-7">
                {footer.working_hours_1 && <p>{footer.working_hours_1}</p>}
                {footer.working_hours_2 && <p>{footer.working_hours_2}</p>}
              </div>
            </div>

            {footer.contact_email && (
              <div className="pt-3 border-t border-blue-900/60 flex items-center gap-2 text-blue-200/80 text-xs">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${footer.contact_email}`}
                  className="hover:text-amber-300 transition break-all"
                >
                  {footer.contact_email}
                </a>
              </div>
            )}
          </div>

          {/* Col 3: Information Links (Mobile: full/half, Tablet: 4 cols, Desktop: 2 cols) */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-wide">
              {footer.column_1_title || "Information"}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              {(footer.column_1_links || []).map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url || "#"}
                    className="hover:text-amber-300 hover:translate-x-0.5 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Account Links (Mobile: full/half, Tablet: 4 cols, Desktop: 2 cols) */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-wide">
              {footer.column_2_title || "Account"}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              {(footer.column_2_links || []).map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url || "#"}
                    className="hover:text-amber-300 hover:translate-x-0.5 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Store Links (Mobile: full/half, Tablet: 4 cols, Desktop: 2 cols) */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-wide">
              {footer.column_3_title || "Store"}
            </h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              {(footer.column_3_links || []).map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.url || "#"}
                    className="hover:text-amber-300 hover:translate-x-0.5 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Logos */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70 text-center sm:text-left">
          <p className="order-2 sm:order-1">
            {footer.copyright_text || `Copyright © ${new Date().getFullYear()} Shopia. All Rights Reserved`}
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap order-1 sm:order-2">
            {(footer.payment_methods && footer.payment_methods.length > 0
              ? footer.payment_methods
              : ["BKASH", "ROCKET", "NAGAD", "VISA", "MASTERCARD", "AMEX"]
            ).map((badge, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white/10 text-white font-black rounded text-[10px] tracking-wider uppercase border border-white/20 hover:bg-white/20 transition-colors shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

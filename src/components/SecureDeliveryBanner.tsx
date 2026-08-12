"use client";

import React from "react";
import Link from "next/link";

export function SecureDeliveryBanner() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex items-center justify-between shadow-xs">
        <div className="text-[#0e6962] font-sans">
          <p className="text-lg sm:text-2xl font-bold tracking-tight">
            100% Secure delivery <span className="font-normal text-[#0e6962]/90">without contacting the courier</span>
          </p>
        </div>

        <Link
          href="/delivery-info"
          className="bg-[#00685b] hover:bg-[#005046] text-white font-bold text-sm px-8 py-3 rounded-full transition-all shadow-md shrink-0"
        >
          More
        </Link>
      </div>
    </div>
  );
}

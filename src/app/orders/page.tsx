"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  Search,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user } = useShop();
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!user) {
      router.push("/account");
    }
  }, [user, router]);

  // Sample User Order History Dataset
  const sampleOrders = [
    {
      id: "SHP-2026-8891",
      date: "28 July, 2026",
      total: 1450,
      status: "In Transit",
      paymentMethod: "Cash on Delivery",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      phone: "01681-135030",
      items: [
        { id: "p1", name: "Organic Black Maca Powder (300 gm)", qty: 1, price: 1150, image: "/prod_maca.png", slug: "organic-black-maca-powder" },
        { id: "p2", name: "Mustard Oil (সরিষার তেল)", qty: 1, price: 300, image: "/prod_blackseed.png", slug: "mustard-oil" }
      ]
    },
    {
      id: "SHP-2026-7720",
      date: "14 July, 2026",
      total: 820,
      status: "Delivered",
      paymentMethod: "bKash Digital Payment",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      phone: "01681-135030",
      items: [
        { id: "p3", name: "Raw Organic Honey (সুন্দরবনের মধু)", qty: 2, price: 410, image: "/prod_honey.png", slug: "raw-organic-honey" }
      ]
    },
    {
      id: "SHP-2026-6105",
      date: "02 June, 2026",
      total: 990,
      status: "Processing",
      paymentMethod: "Cash on Delivery",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      phone: "01681-135030",
      items: [
        { id: "p4", name: "Organic White Chia Seeds (চিয়া সিড)", qty: 1, price: 630, image: "/prod_chia.png", slug: "organic-white-chia-seeds" },
        { id: "p5", name: "Vitamin E Soft Capsule", qty: 1, price: 360, image: "/prod_vitamin.png", slug: "vitamin-e-soft-capsule" }
      ]
    }
  ];

  if (!user) return null;

  const filteredOrders = sampleOrders.filter((ord) => {
    const matchesStatus = filterStatus === "All" || ord.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans space-y-8 pb-20">
      
      {/* Top Banner Header */}
      <section className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
            <Link href="/dashboard" className="hover:text-amber-300 flex items-center gap-1 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <span>/</span>
            <span className="text-amber-300">My Orders</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Order History &amp; Tracking
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            View all your past and current purchases, check delivery status, and track shipment packages.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["All", "Processing", "In Transit", "Delivered"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? "bg-[#0b3b82] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st} {st === "All" ? `(${sampleOrders.length})` : ""}
              </button>
            ))}
          </div>

          {/* Search Order Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by Order ID or Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Orders Card List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t placed any orders matching this filter query.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-sm"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5 hover:border-[#0b3b82]/40 transition duration-200"
              >
                {/* Header Information Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Order #{ord.id}
                      </span>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full border ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ord.status === "In Transit"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Placed on <span className="font-semibold text-slate-600">{ord.date}</span>
                    </p>
                  </div>

                  {/* Track Order Direct Button */}
                  <Link
                    href="/track-order"
                    className="bg-[#0b3b82] hover:bg-[#072450] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs shrink-0"
                  >
                    <Truck className="w-4 h-4" /> Track Shipment
                  </Link>
                </div>

                {/* Items List Table/Rows */}
                <div className="space-y-3">
                  {ord.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 relative overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <Link href={`/product/${item.slug || item.id}`}>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm hover:text-[#0b3b82] transition leading-tight">
                              {item.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-slate-400">
                            Quantity: <span className="font-bold text-slate-700">{item.qty}</span> × ৳{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">Item Total</span>
                        <span className="font-extrabold text-[#0b3b82] text-sm">
                          ৳{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Details Summary Bar */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#0b3b82]" /> Payment Info
                    </span>
                    <p className="font-bold text-slate-800">{ord.paymentMethod}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0b3b82]" /> Delivery Address
                    </span>
                    <p className="font-bold text-slate-800 truncate">{ord.shippingAddress}</p>
                  </div>

                  <div className="text-left sm:text-right space-y-0.5">
                    <span className="text-slate-400 font-semibold block">Total Amount Paid</span>
                    <span className="text-xl font-black text-[#0b3b82]">
                      ৳{ord.total.toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

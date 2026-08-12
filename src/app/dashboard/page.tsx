"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { 
  User, 
  Package, 
  Truck, 
  Edit3, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  AlertTriangle,
  Lock,
  Camera,
  Heart,
  ShoppingCart
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, updateProfile, deleteAccount, cart, wishlist, removeFromWishlist, addToCart, setQuickViewProduct, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "profile" | "password" | "delete">("overview");

  // Profile Edit State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Order Tracking Search State
  const [trackingId, setTrackingId] = useState("SHP-2026-8891");
  const [trackedOrder, setTrackedOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/account");
    } else {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone);
      setEditAddress(user.address);
      setEditAvatar(user.avatar || "");
    }
  }, [user, router]);

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditAvatar(base64String);
        updateProfile({ avatar: base64String });
        showToast("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Order History List
  const orders = [
    {
      id: "SHP-2026-8891",
      date: "28 July, 2026",
      total: 1450,
      status: "In Transit",
      paymentMethod: "Cash on Delivery",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      items: [
        { name: "Organic Black Maca Powder", qty: 1, price: 1150, image: "/prod_maca.png" },
        { name: "Mustard Oil (সরিষার তেল)", qty: 1, price: 300, image: "/prod_blackseed.png" }
      ]
    },
    {
      id: "SHP-2026-7720",
      date: "14 July, 2026",
      total: 820,
      status: "Delivered",
      paymentMethod: "bKash Digital Payment",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      items: [
        { name: "Raw Organic Honey (সুন্দরবনের মধু)", qty: 2, price: 410, image: "/prod_honey.png" }
      ]
    },
    {
      id: "SHP-2026-6105",
      date: "02 June, 2026",
      total: 990,
      status: "Processing",
      paymentMethod: "Cash on Delivery",
      shippingAddress: "41/1, Sher-E-Bangla Rd, Mohammadpur, Dhaka 1207",
      items: [
        { name: "Organic White Chia Seeds (চিয়া সিড)", qty: 1, price: 630, image: "/prod_chia.png" },
        { name: "Vitamin E Soft Capsule", qty: 1, price: 360, image: "/prod_vitamin.png" }
      ]
    }
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
      avatar: editAvatar
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast("Please enter your current password!");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match!");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long!");
      return;
    }

    showToast("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      deleteAccount();
      router.push("/");
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find((o) => o.id.toLowerCase() === trackingId.trim().toLowerCase()) || orders[0];
    setTrackedOrder(found);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0b3b82] via-[#092a5e] to-[#b30047] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center font-black text-2xl text-amber-300 shrink-0 overflow-hidden">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="space-y-1">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider">
                Customer Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xs text-blue-100">{user.email} • {user.phone}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/account");
            }}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-6 py-2.5 rounded-full transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Dashboard 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar (Col 3) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" /> Dashboard Overview
            </button>

            <Link
              href="/orders"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" /> My Orders ({orders.length})
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "wishlist"
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist ({wishlist.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-4 h-4" /> Update Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "password"
                  ? "bg-[#0b3b82] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Lock className="w-4 h-4" /> Change Password
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("delete")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "delete"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-rose-600 hover:bg-rose-50"
              }`}
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>

          {/* Right Tab Content Container (Col 9) */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Account Overview
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Cart Items</span>
                    <div className="text-2xl font-black text-[#0b3b82]">{cart.length}</div>
                    <Link href="/cart" className="text-xs font-bold text-[#ff8c00] hover:underline block pt-1">Go to Cart &rarr;</Link>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Wishlist Items</span>
                    <div className="text-2xl font-black text-rose-600">{wishlist.length}</div>
                    <Link href="/wishlist" className="text-xs font-bold text-rose-600 hover:underline block pt-1">Go to Wishlist &rarr;</Link>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</span>
                    <div className="text-2xl font-black text-emerald-600">{orders.length}</div>
                    <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-emerald-600 hover:underline block pt-1">View Orders &rarr;</button>
                  </div>
                </div>

                {/* Profile Details Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Personal Info &amp; Shipping Address</h3>
                    <button onClick={() => setActiveTab("profile")} className="text-xs font-bold text-[#0b3b82] hover:underline">Edit Info</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Name:</span>
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Email:</span>
                      <span className="font-bold text-slate-800">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Phone:</span>
                      <span className="font-bold text-slate-800">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Address:</span>
                      <span className="font-bold text-slate-800">{user.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDER LIST TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      My Orders
                    </h2>
                    <p className="text-xs text-slate-500">Track and manage your order history</p>
                  </div>
                  <span className="bg-[#0b3b82]/10 text-[#0b3b82] font-bold text-xs px-3 py-1 rounded-full">
                    {orders.length} Total Orders
                  </span>
                </div>

                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#0b3b82]/30 transition duration-200"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">Order #{ord.id}</span>
                            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              ord.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : ord.status === "In Transit"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">Placed on {ord.date}</p>
                        </div>

                        {/* Quick Track Action Link */}
                        <Link
                          href="/track-order"
                          className="bg-[#0b3b82] hover:bg-[#072450] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" /> Track Package
                        </Link>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-1 relative overflow-hidden shrink-0 flex items-center justify-center">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-slate-800 text-xs">{item.name}</h4>
                                <p className="text-[11px] text-slate-400">Quantity: {item.qty} × ৳{item.price.toLocaleString()}</p>
                              </div>
                            </div>

                            <span className="font-extrabold text-[#0b3b82] text-xs shrink-0">
                              ৳{(item.price * item.qty).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Summary */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="text-slate-500 space-y-0.5">
                          <p><span className="font-semibold text-slate-700">Payment:</span> {ord.paymentMethod}</p>
                          <p className="truncate max-w-md"><span className="font-semibold text-slate-700">Deliver to:</span> {ord.shippingAddress}</p>
                        </div>
                        <div className="text-right sm:text-right shrink-0">
                          <span className="text-slate-400 text-[11px] block">Grand Total</span>
                          <span className="text-lg font-black text-[#0b3b82]">
                            ৳{ord.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      My Wishlist
                    </h2>
                    <p className="text-xs text-slate-500">Your saved products for future orders</p>
                  </div>
                  <span className="bg-rose-50 text-rose-600 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
                    {wishlist.length} Items
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
                      <Heart className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Your Wishlist is Empty</h3>
                    <p className="text-xs text-slate-400">Save items while browsing to view them here later.</p>
                    <Link
                      href="/"
                      className="inline-block bg-[#0b3b82] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs hover:bg-[#b30047] transition mt-2"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link href={`/product/${item.slug || item.id}`} className="block relative w-full h-36 bg-white rounded-xl overflow-hidden p-2 border border-slate-100">
                          <Image
                            src={item.mainImage}
                            alt={item.name}
                            fill
                            sizes="200px"
                            className="object-contain group-hover:scale-105 transition"
                          />
                        </Link>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.category}</span>
                          <Link href={`/product/${item.slug || item.id}`}>
                            <h4 className="font-bold text-slate-800 text-xs line-clamp-2 hover:text-[#0b3b82] transition leading-snug">
                              {item.name}
                            </h4>
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                          <div className="text-sm font-black text-[#0b3b82]">
                            ৳{item.price.toLocaleString()}
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(item, 1)}
                            className="bg-[#ff8c00] hover:bg-[#e07b00] text-white p-2 rounded-full shadow-xs transition"
                            title="Add to Cart"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. UPDATE PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Update Account Profile
                </h2>

                <form onSubmit={handleProfileSave} className="space-y-5 w-full">
                  
                  {/* Profile Image Uploader */}
                  <div className="flex items-center gap-5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <div className="relative w-20 h-20 rounded-full bg-[#0b3b82] text-white flex items-center justify-center font-black text-2xl border-2 border-slate-200 shadow-sm overflow-hidden shrink-0">
                      {editAvatar ? (
                        <Image
                          src={editAvatar}
                          alt="Profile Avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 block">Profile Picture</label>
                      <p className="text-[11px] text-slate-500">PNG, JPG, or WEBP up to 5MB</p>
                      
                      <label className="inline-flex items-center gap-1.5 bg-[#0b3b82] hover:bg-[#072450] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-xs transition">
                        <Camera className="w-3.5 h-3.5" /> Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Default Address</label>
                    <textarea
                      rows={3}
                      required
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 mt-4"
                  >
                    <Save className="w-4 h-4" /> Save Profile Details
                  </button>
                </form>
              </div>
            )}

            {/* 5. CHANGE PASSWORD TAB */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#0b3b82]" /> Change Password
                </h2>

                <form onSubmit={handlePasswordSave} className="space-y-4 w-full">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0b3b82]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0b3b82] hover:bg-[#b30047] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 mt-4"
                  >
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </form>
              </div>
            )}

            {/* 5. DELETE ACCOUNT MENU TAB */}
            {activeTab === "delete" && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-rose-600 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone: Delete Account
                </h2>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
                  <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                    Warning: Deleting your account will permanently wipe your profile information, order history logs, and saved address preferences.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Confirm Account Deletion
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

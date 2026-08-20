"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  CheckCircle2,
  Heart,
  Share2,
  PhoneCall,
  Sparkles,
  Loader2,
  Maximize2,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { ProductImageModal } from "@/components/ProductImageModal";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, addToWishlist, isInWishlist, showToast } = useShop();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [detailedProduct, setDetailedProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (quickViewProduct) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickViewProduct]);

  // Fetch full details & related products when product opens
  useEffect(() => {
    if (!quickViewProduct) {
      setDetailedProduct(null);
      setRelatedProducts([]);
      setSelectedImageIndex(0);
      setQuantity(1);
      setSelectedAttributes({});
      setIsImageLightboxOpen(false);
      return;
    }

    setQuantity(1);
    setSelectedImageIndex(0);
    const prodIdOrSlug = quickViewProduct.slug || quickViewProduct.id;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    if (!prodIdOrSlug) return;

    setLoadingDetails(true);

    // Fetch full product object
    fetch(`${apiUrl}/api/v1/products/${prodIdOrSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then((data) => {
        const raw = data?.data || data?.product;
        if (raw) {
          const rawPrice = parseFloat(String(raw.price || 0)) || 0;
          const rawSalePrice = raw.sale_price !== null && raw.sale_price !== undefined ? parseFloat(String(raw.sale_price)) : null;

          let activePrice = rawPrice;
          let origPrice: number | undefined = undefined;

          if (rawSalePrice !== null && rawSalePrice > 0 && rawSalePrice < rawPrice) {
            activePrice = rawSalePrice;
            origPrice = rawPrice;
          } else if (raw.originalPrice || raw.original_price) {
            origPrice = parseFloat(String(raw.originalPrice || raw.original_price));
          }

          const mainImg = raw.image || raw.main_image || (Array.isArray(raw.images) && raw.images[0]) || quickViewProduct.mainImage || "/prod_jersey.png";
          let gallery = Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [mainImg];
          if (gallery.length === 1 && quickViewProduct.images && quickViewProduct.images.length > 1) {
            gallery = quickViewProduct.images;
          }

          const fullObj = {
            id: raw.id,
            name: raw.name || quickViewProduct.name,
            slug: raw.slug || quickViewProduct.slug || String(raw.id),
            category: typeof raw.category === "string" ? raw.category : (raw.category?.name || quickViewProduct.category || "MEN"),
            subCategory: raw.sub_category || raw.subCategory || null,
            price: activePrice,
            originalPrice: origPrice || null,
            sku: raw.SKU || raw.sku || quickViewProduct.sku || `BRAZIL-PLAYER-ADDITION-H-Z5FG-DPSD`,
            brand: raw.brand || quickViewProduct.brand || "Nike",
            stock: typeof raw.stock === "number" ? raw.stock : (quickViewProduct.stock || 30),
            stockStatus: (typeof raw.stock === "number" ? raw.stock : 30) > 0 ? "In Stock" : "Out of Stock",
            mainImage: mainImg,
            images: gallery,
            description: raw.description || raw.short_description || quickViewProduct.description || "",
            rating: raw.rating ? parseFloat(String(raw.rating)) : (quickViewProduct.rating || 5.0),
            reviewsCount: raw.reviews_count || quickViewProduct.reviewsCount || 3,
            attributes: Array.isArray(raw.attributes) ? raw.attributes : (quickViewProduct.attributes || []),
            isNew: Boolean(raw.new_arrival || raw.is_new || quickViewProduct.isNew),
            discountPercentage: quickViewProduct.discountPercentage,
          };

          setDetailedProduct(fullObj);

          if (fullObj.attributes && fullObj.attributes.length > 0) {
            const initAttrs: Record<string, string> = {};
            fullObj.attributes.forEach((attr: any) => {
              if (attr.name && attr.value && !initAttrs[attr.name]) {
                initAttrs[attr.name] = attr.value;
              }
            });
            setSelectedAttributes(initAttrs);
          }
        }
      })
      .catch(() => {
        setDetailedProduct(null);
      })
      .finally(() => {
        setLoadingDetails(false);
      });

    // Fetch related products
    fetch(`${apiUrl}/api/v1/products?per_page=4`)
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data?.data || data?.data || [];
        if (Array.isArray(list)) {
          setRelatedProducts(
            list
              .filter((p: any) => String(p.id) !== String(quickViewProduct.id))
              .slice(0, 2)
              .map((rp: any) => ({
                id: rp.id,
                name: rp.name,
                slug: rp.slug || String(rp.id),
                price: parseFloat(String(rp.sale_price || rp.price || 0)) || 0,
                originalPrice: rp.sale_price && rp.price ? parseFloat(String(rp.price)) : null,
                mainImage: rp.image || rp.main_image || (Array.isArray(rp.images) && rp.images[0]) || "/prod_honey.png",
                rating: rp.rating ? parseFloat(String(rp.rating)) : 5.0,
              }))
          );
        }
      })
      .catch(() => {});
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = detailedProduct || {
    id: quickViewProduct.id,
    name: quickViewProduct.name,
    slug: quickViewProduct.slug || String(quickViewProduct.id),
    category: quickViewProduct.category || "MEN",
    brand: quickViewProduct.brand || "Nike",
    stock: quickViewProduct.stock !== undefined ? quickViewProduct.stock : 30,
    sku: quickViewProduct.sku || `BRAZIL-PLAYER-ADDITION-H-Z5FG-DPSD`,
    price: typeof quickViewProduct.price === "number" ? quickViewProduct.price : parseFloat(quickViewProduct.price || "850"),
    originalPrice: quickViewProduct.originalPrice ? (typeof quickViewProduct.originalPrice === "number" ? quickViewProduct.originalPrice : parseFloat(String(quickViewProduct.originalPrice))) : 1000,
    mainImage: quickViewProduct.mainImage || "/prod_jersey.png",
    images: quickViewProduct.images && quickViewProduct.images.length > 0 ? quickViewProduct.images : [quickViewProduct.mainImage],
    rating: quickViewProduct.rating || 5.0,
    reviewsCount: quickViewProduct.reviewsCount || 3,
    description: quickViewProduct.description || quickViewProduct.name,
    isNew: quickViewProduct.isNew !== undefined ? quickViewProduct.isNew : true,
    discountPercentage: quickViewProduct.discountPercentage || 15,
  };

  const price = product.price || 0;
  const originalPriceVal = product.originalPrice && product.originalPrice > price ? product.originalPrice : null;
  const savings = originalPriceVal ? originalPriceVal - price : null;

  const galleryImages: string[] = product.images && product.images.length > 0
    ? product.images
    : [product.mainImage];

  const currentMainImage = galleryImages[selectedImageIndex] || product.mainImage;

  const handleClose = () => {
    setQuickViewProduct(null);
    setQuantity(1);
    setSelectedImageIndex(0);
    setIsImageLightboxOpen(false);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedAttributes }, quantity);
    handleClose();
  };

  const handleBuyNow = () => {
    addToCart({ ...product, selectedAttributes }, quantity);
    handleClose();
    router.push("/cart");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/product/${product.slug || product.id}`;
      if (navigator.share) {
        navigator.share({ title: product.name, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        showToast("Product link copied to clipboard!");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        {/* Overlay Backdrop Click */}
        <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

        {/* Main Modal Card Container */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] flex flex-col">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            type="button"
            aria-label="Close modal"
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* ─── Left Side: Main Product Image & Thumbnails Showcase (5 Cols) ─── */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Main Image Box - Clicking Image Opens Lightbox Modal */}
                <div
                  onClick={() => setIsImageLightboxOpen(true)}
                  className="relative bg-white border border-slate-200 rounded-2xl p-4 min-h-[300px] sm:min-h-[360px] flex items-center justify-center overflow-hidden group shadow-xs cursor-pointer"
                  title="Click image to open in modal view"
                >
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {savings !== null && savings > 0 && (
                      <span className="bg-[#ff0055] text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        -{Math.round((savings / originalPriceVal!) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {product.isNew && (
                    <div className="absolute top-4 right-4 z-20 bg-[#0b3b82] text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      NEW ARRIVAL
                    </div>
                  )}

                  {loadingDetails ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0b3b82]" />
                      <span className="text-xs font-bold">Loading view...</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-[280px] sm:h-[320px]">
                      <Image
                        src={currentMainImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    </div>
                  )}

                  {/* Click to Zoom Icon Overlay */}
                  <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold px-3">
                    <Maximize2 className="w-4 h-4" /> Expand Image
                  </div>
                </div>

                {/* Gallery Thumbnails Row */}
                {galleryImages.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 scrollbar-none">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 bg-slate-50 transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? "border-red-500 ring-2 ring-red-500/20 scale-105"
                            : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          className="object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── Middle / Right Side: Product Details & Purchase Actions (7 Cols) ─── */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Category, Brand, Stock Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-100 text-[#0b3b82] font-black text-[11px] px-3 py-0.5 rounded-md uppercase tracking-wider">
                      {product.category || "MEN"}
                    </span>
                    {product.brand && (
                      <span className="text-slate-600 font-semibold">
                        Brand: <strong className="text-slate-900">{product.brand}</strong>
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                  </span>
                </div>

                {/* Product Title */}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>

                {/* Ratings & SKU Code */}
                <div className="flex items-center justify-between text-xs gap-2 border-b border-slate-100 pb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">
                      {Number(product.rating || 5).toFixed(1)}
                    </span>
                    <span className="text-slate-400">
                      ({product.reviewsCount || 3} reviews)
                    </span>
                  </div>

                  <div className="text-slate-400 font-mono text-[11px]">
                    SKU: <span className="text-slate-700 font-bold">{product.sku}</span>
                  </div>
                </div>

                {/* Pricing Row */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#0b3b82]">
                    ৳ {price.toLocaleString("en-US")}
                  </span>
                  {Boolean(originalPriceVal) && (
                    <span className="text-lg text-slate-400 line-through font-medium">
                      ৳ {originalPriceVal?.toLocaleString("en-US")}
                    </span>
                  )}
                  {Boolean(savings) && savings! > 0 && (
                    <span className="bg-rose-100 text-rose-600 font-extrabold text-xs px-3 py-1 rounded-full border border-rose-200">
                      Save : {savings?.toLocaleString("en-US")}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {product.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {typeof product.description === "string"
                      ? product.description.replace(/<[^>]*>?/gm, "")
                      : product.name}
                  </p>
                )}

                {/* Quantity Counter + Action Buttons */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-3 py-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center font-black text-slate-800 text-sm">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-white transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#ff8c00] hover:bg-[#e07b00] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>

                    {/* Buy Now Button */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 bg-[#0b3b82] hover:bg-[#082859] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Wishlist & Share */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={() => addToWishlist(product)}
                      className="flex items-center gap-1.5 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
                      {isInWishlist(product.id) ? "Saved in Wishlist" : "Add to Wishlist"}
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center gap-1.5 hover:text-[#0b3b82] transition cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-[#0b3b82]" /> Share Product
                    </button>
                  </div>
                </div>

                {/* Direct Phone Order Hotline Banner */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Direct Phone Order Hotline</p>
                    <p className="text-[11px] text-slate-500">Call anytime for quick COD booking</p>
                  </div>
                  <a
                    href="tel:01681135030"
                    className="bg-[#0b3b82] hover:bg-[#072450] text-white font-black text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> 01681-135030
                  </a>
                </div>

              </div>

            </div>

            {/* Related Products Preview Section inside Modal */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff8c00]" /> Related Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      className="flex items-center gap-3 border border-slate-100 rounded-2xl p-3 bg-slate-50/50 hover:bg-white hover:shadow-md transition group"
                    >
                      <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={rel.mainImage}
                          alt={rel.name}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-[#0b3b82]">
                          {rel.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-[#ff8c00] font-black text-xs">
                            ৳{rel.price?.toLocaleString()}
                          </span>
                          {Boolean(rel.originalPrice && rel.originalPrice > rel.price) && (
                            <span className="text-slate-400 line-through text-[10px]">
                              ৳{rel.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(rel)}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-[#0b3b82] hover:text-white hover:border-[#0b3b82] text-[11px] font-bold px-3 py-1.5 rounded-full transition shadow-xs cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Image Lightbox Modal */}
      <ProductImageModal
        isOpen={isImageLightboxOpen}
        onClose={() => setIsImageLightboxOpen(false)}
        images={galleryImages}
        initialIndex={selectedImageIndex}
        productName={product.name}
      />
    </>
  );
}

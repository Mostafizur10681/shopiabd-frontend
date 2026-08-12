"use client";

import React, { createContext, useContext, useState } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface ShopContextType {
  cart: any[];
  wishlist: any[];
  user: UserProfile | null;
  login: (userData: UserProfile, token?: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (productId: number | string, delta: number) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number | string) => void;
  isInWishlist: (productId: number | string) => boolean;
  quickViewProduct: any | null;
  setQuickViewProduct: (product: any | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore cart, wishlist, and user from localStorage on mount
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopia_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("shopia_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem("shopia_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      // Check API profile if token exists
      const token = localStorage.getItem("shopia_token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        })
        .then(r => r.json())
        .then(data => {
          if (data && (data.data || data.user)) {
            const u = data.data || data.user;
            const profile: UserProfile = {
              name: u.name || "Customer",
              email: u.email || "",
              phone: u.phone || "",
              address: u.address || "",
              avatar: u.avatar || undefined,
            };
            setUser(profile);
            localStorage.setItem("shopia_user", JSON.stringify(profile));
          }
        })
        .catch(() => {});
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart & wishlist changes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("shopia_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  React.useEffect(() => {
    try {
      localStorage.setItem("shopia_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const login = (userData: UserProfile, token?: string) => {
    setUser(userData);
    try {
      localStorage.setItem("shopia_user", JSON.stringify(userData));
      if (token) localStorage.setItem("shopia_token", token);
    } catch {}
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    try {
      const token = localStorage.getItem("shopia_token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        }).catch(() => {});
      }
      localStorage.removeItem("shopia_token");
      localStorage.removeItem("shopia_user");
    } catch {}
    showToast("Logged out successfully.");
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    // Optimistic local update
    setUser((prev) => {
      const updated = prev ? { ...prev, ...updatedData } : (updatedData as UserProfile);
      if (updated) {
        localStorage.setItem("shopia_user", JSON.stringify(updated));
      }
      return updated;
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("shopia_token") : null;
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/profile`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(updatedData)
        });
        const data = await res.json();
        if (data && (data.data?.user || data.data || data.user)) {
          const u = data.data?.user || data.data || data.user;
          const profile: UserProfile = {
            name: u.name || updatedData.name || "Customer",
            email: u.email || updatedData.email || "",
            phone: u.phone || updatedData.phone || "",
            address: u.address || updatedData.address || "",
            avatar: u.avatar || u.profile_pic || updatedData.avatar || undefined,
          };
          setUser(profile);
          localStorage.setItem("shopia_user", JSON.stringify(profile));
        }
      } catch {
        // keep optimistic update
      }
    }
    showToast("Profile updated successfully!");
  };

  const deleteAccount = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("shopia_token") : null;
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/delete-account`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
      } catch {
        // Continue clearing local state
      }
    }
    setUser(null);
    setCart([]);
    setWishlist([]);
    try {
      localStorage.removeItem("shopia_token");
      localStorage.removeItem("shopia_user");
    } catch {}
    showToast("Your account has been permanently deleted.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`"${product.name}" added to cart successfully!`);
  };

  const updateQuantity = (productId: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from cart!");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared!");
  };

  const addToWishlist = (product: any) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        showToast(`"${product.name}" removed from wishlist!`);
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`"${product.name}" added to wishlist!`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number | string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: number | string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        login,
        logout,
        updateProfile,
        deleteAccount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}

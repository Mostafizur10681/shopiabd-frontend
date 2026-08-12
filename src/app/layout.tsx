"use client";

import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopProvider } from "@/context/ShopContext";
import { QuickViewModal } from "@/components/QuickViewModal";
import { NotificationToast } from "@/components/NotificationToast";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <ShopProvider>
          <Header />
          <main className="flex-1 bg-slate-50">
            {children}
          </main>
          <Footer />
          <QuickViewModal />
          <NotificationToast />
          <ScrollToTopButton />
        </ShopProvider>
      </body>
    </html>
  );
}

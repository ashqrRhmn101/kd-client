"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminBanner from "@/components/AdminBanner";

// The admin panel (app/admin/layout.js) renders its own header/sidebar/nav.
// Without this check, the storefront Header + nav strip + Footer were ALSO
// rendering around every /admin page (since they live in the root layout),
// stacking on top of the admin UI. On mobile this pushed the actual
// dashboard content far down the page — looking like "nothing shows up"
// without scrolling past a wall of duplicate navigation first.
export default function StorefrontChrome({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return <>{children}</>;

  return (
    <>
      <Header />
      <AdminBanner />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

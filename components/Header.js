"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Truck, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AvatarMenu from "@/components/AvatarMenu";
import SearchAutocomplete from "@/components/SearchAutocomplete";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/products", label: "সব প্রোডাক্ট" },
  { href: "/orders/track", label: "অর্ডার ট্র্যাক" },
  { href: "/contact", label: "যোগাযোগ" },
  { href: "/faq", label: "সচরাচর জিজ্ঞাসা" },
];

export default function Header() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Top bar: logo, search, cart, account */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-page flex items-center gap-4 py-2.5">
          <Link href="/" className="text-lg font-extrabold whitespace-nowrap">
            <span className="text-primary-600">Khalid&apos;s</span> <span className="text-secondary-500">Dreams</span>
          </Link>

          <div className="hidden sm:block max-w-xs w-full">
            <SearchAutocomplete />
          </div>

          <nav className="flex items-center gap-4 text-sm font-medium ml-auto">
            <Link href="/cart" className="relative hover:text-primary-600">
              <ShoppingCart className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <AvatarMenu />
          </nav>
        </div>

        <div className="sm:hidden container-page pb-2.5">
          <SearchAutocomplete compact />
        </div>
      </div>

      {/* Mobile nav strip — horizontally scrollable */}
      <div className="bg-primary-600 text-white md:hidden overflow-x-auto">
        <div className="flex gap-5 text-xs px-4 py-2 whitespace-nowrap">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-secondary-300 font-semibold" : "text-white/90"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom nav strip — brand green background, orange active/hover accent */}
      <div className="bg-primary-600 text-white hidden md:block">
        <div className="container-page flex items-center gap-6 text-sm py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${pathname === link.href ? "text-secondary-300 font-semibold" : "hover:text-secondary-300"}`}
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-primary-100">
            <Truck className="w-3.5 h-3.5" /> সারা বাংলাদেশে ডেলিভারি
          </span>
          <span className="flex items-center gap-1.5 text-xs text-primary-100">
            <Phone className="w-3.5 h-3.5" /> +8801XXXXXXXXX
          </span>
        </div>
      </div>
    </header>
  );
}

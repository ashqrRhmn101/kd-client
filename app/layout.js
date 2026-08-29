import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { LoadingBarProvider } from "@/context/LoadingBarContext";
import StorefrontChrome from "@/components/StorefrontChrome";

export const metadata = {
  title: "Khalid's Dreams — অনলাইন শপিং",
  description: "সেরা দামে প্রয়োজনীয় সব পণ্য, দ্রুত ডেলিভারি সহ।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <LoadingBarProvider>
          <AuthProvider>
            <CartProvider>
              <StorefrontChrome>{children}</StorefrontChrome>
            </CartProvider>
          </AuthProvider>
        </LoadingBarProvider>
      </body>
    </html>
  );
}

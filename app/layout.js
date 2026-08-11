import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Khalid's Dreams — অনলাইন শপিং",
  description: "সেরা দামে প্রয়োজনীয় সব পণ্য, দ্রুত ডেলিভারি সহ।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

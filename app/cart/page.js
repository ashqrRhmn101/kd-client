"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-gray-400 mb-4">আপনার কার্ট খালি</p>
        <Link href="/" className="btn-primary">শপিং করুন</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-lg font-bold mb-4">আপনার কার্ট ({items.length} টি প্রোডাক্ট)</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.key} className="card p-3 flex gap-3">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                {Object.entries(item.selectedVariant || {}).length > 0 && (
                  <p className="text-xs text-gray-400">
                    {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-2 py-0.5">−</button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-2 py-0.5">+</button>
                  </div>
                  <span className="font-bold text-brand-600">৳{item.price * item.quantity}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.key)} className="text-red-500 text-sm self-start">✕</button>
            </div>
          ))}
        </div>

        <div className="card p-4 h-fit">
          <h2 className="font-semibold mb-3">অর্ডার সারাংশ</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>সাবটোটাল</span>
            <span>৳{total}</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">ডেলিভারি চার্জ চেকআউটে যোগ হবে</p>
          <Link href="/checkout" className="btn-primary block text-center">চেকআউটে যান</Link>
        </div>
      </div>
    </div>
  );
}

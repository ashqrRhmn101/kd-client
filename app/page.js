import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getData() {
  try {
    const [categoriesRes, topSellingRes, comboRes, allProductsRes] = await Promise.all([
      fetch(`${API}/categories`, { cache: "no-store" }),
      fetch(`${API}/products?topSelling=true&limit=6`, { cache: "no-store" }),
      fetch(`${API}/products?combo=true&limit=6`, { cache: "no-store" }),
      fetch(`${API}/products?limit=12`, { cache: "no-store" }),
    ]);
    const [categories, topSelling, combos, allProducts] = await Promise.all([
      categoriesRes.json(),
      topSellingRes.json(),
      comboRes.json(),
      allProductsRes.json(),
    ]);
    return {
      categories: categories.categories || [],
      topSelling: topSelling.products || [],
      combos: combos.products || [],
      allProducts: allProducts.products || [],
    };
  } catch {
    // Backend not running yet during local dev preview
    return { categories: [], topSelling: [], combos: [], allProducts: [] };
  }
}

// Placeholder banners — replace image URLs with your own uploaded via admin panel later
const banners = [
  { image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200", alt: "Summer Sale" },
  { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200", alt: "New Arrivals" },
];

export default async function HomePage() {
  const { categories, topSelling, combos, allProducts } = await getData();

  return (
    <div className="container-page py-6 space-y-10">
      <BannerCarousel banners={banners} />

      {/* Categories */}
      <section>
        <h2 className="text-lg font-bold mb-4">ক্যাটাগরি সমূহ</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {categories.length === 0 && <p className="text-gray-400 text-sm col-span-full">এখনো কোনো ক্যাটাগরি যুক্ত হয়নি — অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>}
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-1">🛍️</div>
              <div className="text-sm font-medium">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Selling */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">🔥 টপ সেলিং প্রোডাক্ট</h2>
          <Link href="/products?topSelling=true" className="text-primary-600 text-sm font-medium hover:underline">
            সব দেখুন →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {topSelling.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* All products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">সকল প্রোডাক্ট</h2>
          <Link href="/products" className="text-primary-600 text-sm font-medium hover:underline">
            সব দেখুন →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {allProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <BannerCarousel
        banners={[{ image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200", alt: "Combo Offer" }]}
      />

      {/* Combo offers */}
      <section>
        <h2 className="text-lg font-bold mb-4">🎁 কম্বো অফার প্যাক</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {combos.length === 0 && <p className="text-gray-400 text-sm col-span-full">এখনো কোনো কম্বো অফার নেই।</p>}
          {combos.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

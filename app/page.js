import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import SafeImage from "@/components/SafeImage";

const API = process.env.NEXT_PUBLIC_API_URL || "https://kd-server-s10q.onrender.com/";

async function getData() {
  try {
    // AbortSignal.timeout fails fast (5s) instead of letting the page hang
    // for many seconds when the backend is down/unreachable — a slow or
    // refused connection was a real cause of the "frozen for a while" feeling.
    const opts = { next: { revalidate: 30 }, signal: AbortSignal.timeout(5000) };
    const [categoriesRes, topSellingRes, comboRes, allProductsRes] = await Promise.all([
      // `next: { revalidate: 30 }` caches this on the server for 30 seconds —
      // repeat visits to the homepage are served instantly from cache instead
      // of waiting on the backend every single time (this was a big chunk of
      // the "several seconds before anything shows" delay). New products
      // still appear within 30s of being added — a good trade-off for a
      // homepage that doesn't need to be second-by-second live.
      fetch(`${API}/categories`, opts),
      fetch(`${API}/products?topSelling=true&limit=6`, opts),
      fetch(`${API}/products?combo=true&limit=6`, opts),
      fetch(`${API}/products?limit=12`, opts),
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
  } catch (err) {
    // Backend not running/reachable — fail fast (see AbortSignal.timeout
    // above) and show an empty homepage instead of hanging for a long time.
    console.warn("⚠️ হোমপেজের ডেটা fetch ব্যর্থ হয়েছে — backend চালু আছে কিনা, ও NEXT_PUBLIC_API_URL ঠিক আছে কিনা যাচাই করুন:", err.message);
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
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {categories.length === 0 && <p className="text-gray-400 text-sm col-span-full">এখনো কোনো ক্যাটাগরি যুক্ত হয়নি — অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>}
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat._id}`}
              className="card p-2.5 md:p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 mx-auto mb-1.5 rounded-full overflow-hidden bg-primary-50">
                {cat.image ? (
                  <SafeImage src={cat.image} alt={cat.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                )}
              </div>
              <div className="text-xs md:text-sm font-medium line-clamp-1">{cat.name}</div>
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
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
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
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
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
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {combos.length === 0 && <p className="text-gray-400 text-sm col-span-full">এখনো কোনো কম্বো অফার নেই।</p>}
          {combos.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <TestimonialsMarquee />
    </div>
  );
}

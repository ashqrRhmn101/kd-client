"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      topSelling: searchParams.get("topSelling") || undefined,
      page,
      limit: 12,
    };
    api
      .get("/products", { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [searchParams, page]);

  return (
    <div className="container-page py-6">
      <h1 className="text-lg font-bold mb-4">
        {searchParams.get("search") ? `"${searchParams.get("search")}" এর ফলাফল` : "সকল প্রোডাক্ট"}
      </h1>

      {loading ? (
        <div className="py-16 text-center"><ClipLoader color="#16a34a" /></div>
      ) : products.length === 0 ? (
        <p className="text-gray-400">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    p === page ? "bg-primary-500 text-white" : "bg-white border border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

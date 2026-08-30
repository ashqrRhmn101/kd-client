export default function Loading() {
  return (
    <div className="container-page py-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

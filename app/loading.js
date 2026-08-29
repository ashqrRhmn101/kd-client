export default function Loading() {
  return (
    <div className="container-page py-6 space-y-6 animate-pulse">
      <div className="aspect-[16/6] md:aspect-[16/4] bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

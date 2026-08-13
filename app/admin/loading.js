export default function Loading() {
  return (
    <div className="p-4 md:p-8">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  );
}

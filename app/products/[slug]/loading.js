export default function Loading() {
  return (
    <div className="container-page py-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 bg-gray-200 rounded animate-pulse mt-4" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="h-11 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-11 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

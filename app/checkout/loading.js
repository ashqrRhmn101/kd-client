export default function Loading() {
  return (
    <div className="container-page py-6">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-4 h-40 bg-gray-100 animate-pulse" />
          <div className="card p-4 h-32 bg-gray-100 animate-pulse" />
        </div>
        <div className="card p-4 h-40 bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

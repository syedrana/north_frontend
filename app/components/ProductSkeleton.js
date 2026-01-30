export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />

        <div className="flex gap-2 mt-2">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-10 bg-gray-200 rounded" />
        </div>

        {/* color dots */}
        <div className="flex gap-1 mt-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Loading AloTrips...</p>
      </div>
    </div>
  );
}


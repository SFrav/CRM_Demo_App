export default function LogsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div>
            <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-0">
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
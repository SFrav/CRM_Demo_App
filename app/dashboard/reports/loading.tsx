export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded" />
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance card */}
        <div className="card">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between mb-4">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 mx-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 animate-pulse">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: 0 }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 animate-pulse">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: 0 }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" /> 
            </div>
          </div>
        </div>

        {/* Lead Status Distribution card */}
        <div className="card">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between mb-3">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2 animate-pulse">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: 0 }} />
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
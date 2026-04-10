export default function TasksLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg animate-pulse bg-gray-200"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bulk actions placeholder */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>

      {/* Tasks Table */}
      <div className="card p-0">
        <div className="table-responsive">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 animate-pulse">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </th>
                  <th className="px-3 sm:px-6 py-3 text-left"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div></th>
                  <th className="table-header"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></th>
                  <th className="table-header hidden sm:table-cell"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></th>
                  <th className="table-header hidden md:table-cell"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></th>
                  <th className="table-header hidden lg:table-cell"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                  <td className="table-cell hidden sm:table-cell">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-1">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="flex space-x-1">
          <div className="h-8 w-10 bg-gray-200 rounded"></div>
          <div className="h-8 w-10 bg-gray-200 rounded"></div>
          <div className="h-8 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
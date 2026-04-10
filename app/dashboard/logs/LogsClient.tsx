'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ActivityLog } from '@/lib/types/database'
import { Search, Calendar, User, Activity, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

const PAGE_SIZE = 20

interface Props {
  initialLogs: ActivityLog[]
  initialTotalPages: number
}

export default function LogsClient({ initialLogs, initialTotalPages }: Props) {
  const [logs, setLogs]               = useState<ActivityLog[]>(initialLogs)
  const [loading, setLoading]         = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(initialTotalPages)
  const supabase = createClient()

  const fetchLogs = async (page = currentPage) => {
    setLoading(true)
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (entityFilter !== 'all') query = query.eq('entity_type', entityFilter)
      if (searchQuery) query = query.or(`action.ilike.%${searchQuery}%,user_name.ilike.%${searchQuery}%`)

      const { data, error, count } = await query
      if (error) throw error
      setLogs(data ?? [])
      setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE))
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  useEffect(() => {
    fetchLogs(currentPage)
  }, [currentPage])

  // Search + filter (debounced, resets to page 1)
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1)
      fetchLogs(1)
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery, entityFilter])

  const getEntityIcon = (type: string) =>
    ({ task: '📋', lead: '👤', team_member: '👥' }[type] ?? '📄')

  const getActionColor = (action: string) => {
    if (action.includes('created') || action.includes('added'))   return 'text-green-600 bg-green-50'
    if (action.includes('updated') || action.includes('modified')) return 'text-blue-600 bg-blue-50'
    if (action.includes('deleted') || action.includes('removed'))  return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
        <button onClick={() => fetchLogs(currentPage)} className="btn-secondary flex items-center">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Entities</option>
            <option value="task">Tasks</option>
            <option value="lead">Leads</option>
            <option value="team_member">Team Members</option>
          </select>
        </div>
      </div>

      <div className="card p-0">
        {loading ? (
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 flex items-start space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map(log => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {getEntityIcon(log.entity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-gray-500">{log.entity_type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{log.user_name}</span>
                    </div>
                    {log.details && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, logs.length)} of {logs.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >Previous</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm border rounded-lg ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 hover:bg-gray-50'}`}
              >{page}</button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
          <p className="text-gray-500">Activity will appear here as users interact with the system.</p>
        </div>
      )}
    </div>
  )
}

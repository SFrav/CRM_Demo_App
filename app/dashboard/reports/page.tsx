'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, TrendingUp, Users, UserPlus, CheckSquare, DollarSign, Calendar, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReportData {
  totalTasks: number
  completedTasks: number
  totalLeads: number
  convertedLeads: number
  totalTeamMembers: number
  activeMembers: number
  totalValue: number
  monthlyStats: {
    month: string
    tasks: number
    leads: number
    conversions: number
  }[]
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const supabase = createClient()

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      // Fetch tasks data
      const { data: tasks } = await supabase.from('tasks').select('status, created_at')
      const { data: leads } = await supabase.from('leads').select('status, value, created_at')
      const { data: members } = await supabase.from('team_members').select('status, created_at')

      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
      const totalLeads = leads?.length || 0
      const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0
      const totalTeamMembers = members?.length || 0
      const activeMembers = members?.filter(m => m.status === 'active').length || 0
      const totalValue = leads?.reduce((sum, lead) => sum + (lead.value || 0), 0) || 0

      // Generate monthly stats (simplified)
      const monthlyStats = [
        { month: 'Jan', tasks: Math.floor(totalTasks * 0.15), leads: Math.floor(totalLeads * 0.12), conversions: Math.floor(convertedLeads * 0.1) },
        { month: 'Feb', tasks: Math.floor(totalTasks * 0.18), leads: Math.floor(totalLeads * 0.15), conversions: Math.floor(convertedLeads * 0.15) },
        { month: 'Mar', tasks: Math.floor(totalTasks * 0.22), leads: Math.floor(totalLeads * 0.18), conversions: Math.floor(convertedLeads * 0.2) },
        { month: 'Apr', tasks: Math.floor(totalTasks * 0.25), leads: Math.floor(totalLeads * 0.22), conversions: Math.floor(convertedLeads * 0.25) },
        { month: 'May', tasks: Math.floor(totalTasks * 0.20), leads: Math.floor(totalLeads * 0.33), conversions: Math.floor(convertedLeads * 0.3) },
      ]

      setReportData({
        totalTasks,
        completedTasks,
        totalLeads,
        convertedLeads,
        totalTeamMembers,
        activeMembers,
        totalValue,
        monthlyStats
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const conversionRate = reportData ? (reportData.convertedLeads / reportData.totalLeads * 100) || 0 : 0
  const taskCompletionRate = reportData ? (reportData.completedTasks / reportData.totalTasks * 100) || 0 : 0

  const exportToCSV = () => {
    if (!reportData) return

    try {
      const csvData = [
        ['CRM Report - Generated on', new Date().toLocaleDateString()],
        [''],
        ['Key Metrics'],
        ['Metric', 'Value'],
        ['Total Tasks', reportData.totalTasks],
        ['Completed Tasks', reportData.completedTasks],
        ['Task Completion Rate', `${taskCompletionRate.toFixed(1)}%`],
        ['Total Leads', reportData.totalLeads],
        ['Converted Leads', reportData.convertedLeads],
        ['Conversion Rate', `${conversionRate.toFixed(1)}%`],
        ['Total Team Members', reportData.totalTeamMembers],
        ['Active Team Members', reportData.activeMembers],
        ['Total Pipeline Value', `$${reportData.totalValue.toLocaleString()}`],
        [''],
        ['Monthly Performance'],
        ['Month', 'Tasks', 'Leads', 'Conversions'],
        ...reportData.monthlyStats.map(stat => [stat.month, stat.tasks, stat.leads, stat.conversions])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `crm-report-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Report exported successfully!')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your CRM performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="btn-primary flex items-center"
            disabled={!reportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl font-semibold text-gray-900">{taskCompletionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{reportData?.completedTasks} of {reportData?.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">{reportData?.convertedLeads} of {reportData?.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${reportData?.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Pipeline value</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Team</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData?.activeMembers}</p>
              <p className="text-sm text-gray-500">of {reportData?.totalTeamMembers} members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            {reportData?.monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{stat.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(stat.tasks / (reportData.totalTasks || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(stat.leads / (reportData.totalLeads || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">{stat.tasks}T / {stat.leads}L</div>
                  <div className="text-xs text-gray-500">{stat.conversions} conv</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-gray-600">Leads</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Contacted</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Qualified</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">20%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Converted</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lost</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{reportData?.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
            <div className="text-xs text-gray-500 mt-1">
              {reportData?.completedTasks} completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{reportData?.totalLeads}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
            <div className="text-xs text-gray-500 mt-1">
              {reportData?.convertedLeads} converted
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{reportData?.totalTeamMembers}</div>
            <div className="text-sm text-gray-600">Team Members</div>
            <div className="text-xs text-gray-500 mt-1">
              {reportData?.activeMembers} active
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, CheckSquare, UserPlus, TrendingUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  totalLeads: number
  convertedLeads: number
  totalTeamMembers: number
  activeMembers: number
}

interface RecentActivity {
  id: string
  action: string
  user_name: string
  created_at: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [tasksResult, leadsResult, membersResult, activitiesResult] = await Promise.all([
        supabase.from('tasks').select('status'),
        supabase.from('leads').select('status'),
        supabase.from('team_members').select('status'),
        supabase.from('activity_logs').select('id, action, user_name, created_at').order('created_at', { ascending: false }).limit(4)
      ])

      const tasks = tasksResult.data || []
      const leads = leadsResult.data || []
      const members = membersResult.data || []
      const activities = activitiesResult.data || []

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        totalLeads: leads.length,
        convertedLeads: leads.filter(l => l.status === 'converted').length,
        totalTeamMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
      })

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const conversionRate = stats ? (stats.convertedLeads / stats.totalLeads * 100) || 0 : 0
  const completionRate = stats ? (stats.completedTasks / stats.totalTasks * 100) || 0 : 0

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your CRM.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="btn-secondary flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalTasks || 0}</p>
                <p className="ml-2 text-sm font-medium text-green-600">
                  {completionRate.toFixed(1)}% done
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalTeamMembers || 0}</p>
                <p className="ml-2 text-sm font-medium text-green-600">
                  {stats?.activeMembers || 0} active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalLeads || 0}</p>
                <p className="ml-2 text-sm font-medium text-blue-600">
                  {stats?.convertedLeads || 0} converted
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(1)}%</p>
                <p className="ml-2 text-sm font-medium text-purple-600">
                  this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            <Link href="/dashboard/logs" className="text-sm text-primary-600 hover:text-primary-800">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user_name} • {getTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">No recent activities</p>
                <p className="text-xs text-gray-400">Activities will appear here as you use the CRM</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/tasks" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left block">
              <CheckSquare className="w-6 h-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Tasks</p>
              <p className="text-xs text-gray-500">View and create tasks</p>
            </Link>
            <Link href="/dashboard/leads" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left block">
              <UserPlus className="w-6 h-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Leads</p>
              <p className="text-xs text-gray-500">Track your leads</p>
            </Link>
            <Link href="/dashboard/team" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left block">
              <Users className="w-6 h-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Team Members</p>
              <p className="text-xs text-gray-500">Manage your team</p>
            </Link>
            <Link href="/dashboard/reports" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left block">
              <TrendingUp className="w-6 h-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Analytics & insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
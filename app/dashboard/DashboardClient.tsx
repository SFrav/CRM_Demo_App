'use client'

import { useState } from 'react'
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

interface Props {
  initialStats: DashboardStats
  initialActivities: RecentActivity[]
}

export default function DashboardClient({ initialStats, initialActivities }: Props) {
  const [stats, setStats]               = useState<DashboardStats>(initialStats)
  const [recentActivities, setActivities] = useState<RecentActivity[]>(initialActivities)
  const [loading, setLoading]           = useState(false)
  const supabase = createClient()

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [tasksResult, leadsResult, membersResult, activitiesResult] = await Promise.all([
        supabase.from('tasks').select('status'),
        supabase.from('leads').select('status'),
        supabase.from('team_members').select('status'),
        supabase.from('activity_logs')
          .select('id, action, user_name, created_at')
          .order('created_at', { ascending: false })
          .limit(4)
      ])

      const tasks   = tasksResult.data   ?? []
      const leads   = leadsResult.data   ?? []
      const members = membersResult.data ?? []

      setStats({
        totalTasks:       tasks.length,
        completedTasks:   tasks.filter(t => t.status === 'completed').length,
        totalLeads:       leads.length,
        convertedLeads:   leads.filter(l => l.status === 'converted').length,
        totalTeamMembers: members.length,
        activeMembers:    members.filter(m => m.status === 'active').length,
      })
      setActivities(activitiesResult.data ?? [])
    } catch (error) {
      console.error('Error refreshing dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const diffInMinutes = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 60000
    )
    if (diffInMinutes < 1)    return 'Just now'
    if (diffInMinutes < 60)   return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const conversionRate  = (stats.convertedLeads / stats.totalLeads  * 100) || 0
  const completionRate  = (stats.completedTasks  / stats.totalTasks  * 100) || 0

  return (
    <div className="responsive-space-y animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="responsive-title">Dashboard</h1>
          <p className="responsive-subtitle">Welcome back! Here's what's happening with your CRM.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-secondary flex items-center justify-center sm:justify-start"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckSquare className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
                <p className="ml-2 text-sm font-medium text-green-600">{completionRate.toFixed(1)}% done</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTeamMembers}</p>
                <p className="ml-2 text-sm font-medium text-green-600">{stats.activeMembers} active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Leads</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalLeads}</p>
                <p className="ml-2 text-sm font-medium text-blue-600">{stats.convertedLeads} converted</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(1)}%</p>
                <p className="ml-2 text-sm font-medium text-purple-600">this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-grid-2">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            <Link href="/dashboard/logs" className="text-sm text-primary-600 hover:text-primary-800">View all</Link>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 break-words">{activity.action}</p>
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

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/dashboard/tasks',   Icon: CheckSquare, label: 'Manage Tasks',   sub: 'View and create tasks' },
              { href: '/dashboard/leads',   Icon: UserPlus,    label: 'Manage Leads',   sub: 'Track your leads' },
              { href: '/dashboard/team',    Icon: Users,       label: 'Team Members',   sub: 'Manage your team' },
              { href: '/dashboard/reports', Icon: TrendingUp,  label: 'View Reports',   sub: 'Analytics & insights' },
            ].map(({ href, Icon, label, sub }) => (
              <Link key={href} href={href} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 block">
                <Icon className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

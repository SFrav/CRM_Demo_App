import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()

  const [tasksResult, leadsResult, membersResult, activitiesResult] = await Promise.all([
    supabase.from('tasks').select('status'),
    supabase.from('leads').select('status'),
    supabase.from('team_members').select('status'),
    supabase.from('activity_logs')
      .select('id, action, user_name, created_at')
      .order('created_at', { ascending: false })
      .limit(4)
  ])

  const tasks    = tasksResult.data    ?? []
  const leads    = leadsResult.data    ?? []
  const members  = membersResult.data  ?? []
  const activities = activitiesResult.data ?? []

  const stats = {
    totalTasks:       tasks.length,
    completedTasks:   tasks.filter(t => t.status === 'completed').length,
    totalLeads:       leads.length,
    convertedLeads:   leads.filter(l => l.status === 'converted').length,
    totalTeamMembers: members.length,
    activeMembers:    members.filter(m => m.status === 'active').length,
  }

  return <DashboardClient initialStats={stats} initialActivities={activities} />
}
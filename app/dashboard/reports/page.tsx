import { createClient } from '@/lib/supabase/server'
import ReportsClient from './ReportsClient'

export default async function ReportsPage() {
  const supabase = createClient()

  const [{ data: tasks }, { data: leads }, { data: members }] = await Promise.all([
    supabase.from('tasks').select('status, created_at'),
    supabase.from('leads').select('status, value, created_at'),
    supabase.from('team_members').select('status, created_at'),
  ])

  return (
    <ReportsClient
      initialTasks={tasks ?? []}
      initialLeads={leads ?? []}
      initialMembers={members ?? []}
    />
  )
}
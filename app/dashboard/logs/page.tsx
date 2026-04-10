import { createClient } from '@/lib/supabase/server'
import LogsClient from './LogsClient'
import { ActivityLog } from '@/lib/types/database'

const PAGE_SIZE = 20

export default async function LogsPage() {
  const supabase = createClient()

  const { data, count } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  return (
    <LogsClient
      initialLogs={(data ?? []) as ActivityLog[]}
      initialTotalPages={Math.ceil((count ?? 0) / PAGE_SIZE)}
    />
  )
}
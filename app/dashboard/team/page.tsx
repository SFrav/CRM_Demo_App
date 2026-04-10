import { createClient } from '@/lib/supabase/server'
import TeamPageClient from './TeamClient'

export default async function TeamPage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: false })

  return <TeamPageClient initialMembers={members ?? []} />
}
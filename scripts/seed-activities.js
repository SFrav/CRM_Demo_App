// Script to seed some sample activity logs for demo purposes
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://czlqipbmelqoukvbazgs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bHFpcGJtZWxxb3VrdmJhemdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzk1ODksImV4cCI6MjA4MTcxNTU4OX0.rDO2ZJv7yWJdq4AmAFL7EFhnTnfdkywIiRyN5RTUPfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedActivities() {
  try {
    console.log('Seeding sample activity logs...')
    
    // Get some existing IDs from the database
    const { data: tasks } = await supabase.from('tasks').select('id, title').limit(3)
    const { data: leads } = await supabase.from('leads').select('id, name').limit(3)
    const { data: members } = await supabase.from('team_members').select('id, name').limit(3)
    
    const sampleActivities = []
    
    // Add some sample activities with recent timestamps
    const now = new Date()
    
    if (tasks && tasks.length > 0) {
      sampleActivities.push({
        action: 'Task created',
        entity_type: 'task',
        entity_id: tasks[0].id,
        user_name: 'John Doe',
        details: { title: tasks[0].title },
        created_at: new Date(now.getTime() - 5 * 60 * 1000).toISOString() // 5 minutes ago
      })
      
      if (tasks[1]) {
        sampleActivities.push({
          action: 'Task updated',
          entity_type: 'task',
          entity_id: tasks[1].id,
          user_name: 'Jane Smith',
          details: { title: tasks[1].title, changes: { status: 'in_progress' } },
          created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString() // 15 minutes ago
        })
      }
    }
    
    if (leads && leads.length > 0) {
      sampleActivities.push({
        action: 'Lead created',
        entity_type: 'lead',
        entity_id: leads[0].id,
        user_name: 'Mike Johnson',
        details: { name: leads[0].name },
        created_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      })
      
      if (leads[1]) {
        sampleActivities.push({
          action: 'Lead updated',
          entity_type: 'lead',
          entity_id: leads[1].id,
          user_name: 'Sarah Wilson',
          details: { name: leads[1].name, changes: { status: 'qualified' } },
          created_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString() // 45 minutes ago
        })
      }
    }
    
    if (members && members.length > 0) {
      sampleActivities.push({
        action: 'Team member added',
        entity_type: 'team_member',
        entity_id: members[0].id,
        user_name: 'David Brown',
        details: { name: members[0].name },
        created_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString() // 1 hour ago
      })
    }
    
    if (sampleActivities.length > 0) {
      const { error } = await supabase
        .from('activity_logs')
        .insert(sampleActivities)
      
      if (error) {
        console.error('Error inserting activities:', error)
      } else {
        console.log(`✅ Successfully seeded ${sampleActivities.length} activity logs`)
      }
    } else {
      console.log('⚠️ No data found to create sample activities')
    }
    
  } catch (error) {
    console.error('❌ Error seeding activities:', error)
  }
}

seedActivities()
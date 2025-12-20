// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://czlqipbmelqoukvbazgs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bHFpcGJtZWxxb3VrdmJhemdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzk1ODksImV4cCI6MjA4MTcxNTU4OX0.rDO2ZJv7yWJdq4AmAFL7EFhnTnfdkywIiRyN5RTUPfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('tasks').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log('✅ Database accessible!')
    return true
    
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

testConnection()
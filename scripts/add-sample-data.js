// Script to add more sample data to test pagination
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://czlqipbmelqoukvbazgs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bHFpcGJtZWxxb3VrdmJhemdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzk1ODksImV4cCI6MjA4MTcxNTU4OX0.rDO2ZJv7yWJdq4AmAFL7EFhnTnfdkywIiRyN5RTUPfE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addSampleData() {
  try {
    console.log('Adding sample tasks and leads for pagination testing...')
    
    // Add more sample tasks
    const sampleTasks = [
      { title: 'Implement User Roles', description: 'Add role-based access control', status: 'todo', priority: 'high' },
      { title: 'Setup CI/CD Pipeline', description: 'Automate deployment process', status: 'in_progress', priority: 'medium' },
      { title: 'Add Data Validation', description: 'Implement form validation', status: 'todo', priority: 'medium' },
      { title: 'Create API Documentation', description: 'Document all API endpoints', status: 'todo', priority: 'low' },
      { title: 'Implement Search Feature', description: 'Add global search functionality', status: 'in_progress', priority: 'high' },
      { title: 'Setup Monitoring', description: 'Add application monitoring', status: 'todo', priority: 'medium' },
      { title: 'Optimize Database', description: 'Improve query performance', status: 'todo', priority: 'high' },
      { title: 'Add Export Features', description: 'Allow data export to CSV/PDF', status: 'completed', priority: 'medium' },
      { title: 'Implement Notifications', description: 'Add real-time notifications', status: 'todo', priority: 'low' },
      { title: 'Create User Guide', description: 'Write comprehensive user documentation', status: 'todo', priority: 'low' }
    ]

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(sampleTasks)

    if (tasksError) {
      console.error('Error adding tasks:', tasksError)
    } else {
      console.log(`✅ Added ${sampleTasks.length} sample tasks`)
    }

    // Add more sample leads
    const sampleLeads = [
      { name: 'Enterprise Corp', email: 'sales@enterprise.com', company: 'Enterprise Corp', status: 'new', source: 'Website', value: 120000 },
      { name: 'Startup Hub', email: 'info@startuphub.com', company: 'Startup Hub', status: 'contacted', source: 'Referral', value: 35000 },
      { name: 'Tech Solutions', email: 'contact@techsol.com', company: 'Tech Solutions', status: 'qualified', source: 'Cold Call', value: 85000 },
      { name: 'Digital Agency', email: 'hello@digitalagency.com', company: 'Digital Agency', status: 'new', source: 'Social Media', value: 45000 },
      { name: 'Finance Group', email: 'team@financegroup.com', company: 'Finance Group', status: 'contacted', source: 'LinkedIn', value: 95000 },
      { name: 'Healthcare Inc', email: 'info@healthcare.com', company: 'Healthcare Inc', status: 'qualified', source: 'Trade Show', value: 150000 },
      { name: 'Education Platform', email: 'contact@eduplatform.com', company: 'Education Platform', status: 'new', source: 'Email Campaign', value: 25000 },
      { name: 'Retail Solutions', email: 'sales@retailsol.com', company: 'Retail Solutions', status: 'converted', source: 'Website', value: 75000 },
      { name: 'Manufacturing Ltd', email: 'info@manufacturing.com', company: 'Manufacturing Ltd', status: 'contacted', source: 'Cold Call', value: 110000 },
      { name: 'Consulting Firm', email: 'partners@consulting.com', company: 'Consulting Firm', status: 'lost', source: 'Referral', value: 65000 }
    ]

    const { error: leadsError } = await supabase
      .from('leads')
      .insert(sampleLeads)

    if (leadsError) {
      console.error('Error adding leads:', leadsError)
    } else {
      console.log(`✅ Added ${sampleLeads.length} sample leads`)
    }

    console.log('🎉 Sample data added successfully!')
    console.log('Now you should see pagination on both Tasks and Leads pages')
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  }
}

addSampleData()
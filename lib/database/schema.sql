-- Create tables
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source VARCHAR(100) NOT NULL,
  value DECIMAL(10,2),
  notes TEXT,
  assigned_to UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_name VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for demo purposes)
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_logs" ON activity_logs FOR ALL USING (true);

-- Insert sample data
INSERT INTO team_members (name, email, role, department, phone, status) VALUES
('John Doe', 'john@demo.com', 'Sales Manager', 'Sales', '+1-555-0101', 'active'),
('Jane Smith', 'jane@demo.com', 'Developer', 'Engineering', '+1-555-0102', 'active'),
('Mike Johnson', 'mike@demo.com', 'Marketing Lead', 'Marketing', '+1-555-0103', 'active'),
('Sarah Wilson', 'sarah@demo.com', 'Support Specialist', 'Support', '+1-555-0104', 'active'),
('David Brown', 'david@demo.com', 'Product Manager', 'Product', '+1-555-0105', 'active'),
('Lisa Davis', 'lisa@demo.com', 'Designer', 'Design', '+1-555-0106', 'active'),
('Tom Anderson', 'tom@demo.com', 'Sales Rep', 'Sales', '+1-555-0107', 'active'),
('Emma Taylor', 'emma@demo.com', 'QA Engineer', 'Engineering', '+1-555-0108', 'active');

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Setup CRM Database', 'Configure the initial database schema and tables', 'completed', 'high', NOW() - INTERVAL '2 days'),
('Design User Interface', 'Create mockups and wireframes for the CRM interface', 'in_progress', 'high', NOW() + INTERVAL '3 days'),
('Implement Authentication', 'Setup user login and registration system', 'completed', 'high', NOW() - INTERVAL '1 day'),
('Create Dashboard', 'Build the main dashboard with key metrics', 'in_progress', 'medium', NOW() + INTERVAL '5 days'),
('Add Task Management', 'Implement CRUD operations for tasks', 'todo', 'medium', NOW() + INTERVAL '7 days'),
('Setup Email Notifications', 'Configure email alerts for important events', 'todo', 'low', NOW() + INTERVAL '10 days'),
('Mobile Responsiveness', 'Ensure the app works well on mobile devices', 'todo', 'medium', NOW() + INTERVAL '14 days'),
('Performance Optimization', 'Optimize database queries and page load times', 'todo', 'high', NOW() + INTERVAL '21 days');

INSERT INTO leads (name, email, phone, company, status, source, value, notes) VALUES
('Acme Corporation', 'contact@acme.com', '+1-555-1001', 'Acme Corp', 'qualified', 'Website', 50000.00, 'Interested in enterprise plan'),
('Tech Startup Inc', 'hello@techstartup.com', '+1-555-1002', 'Tech Startup', 'contacted', 'Referral', 25000.00, 'Small team, budget conscious'),
('Global Solutions Ltd', 'info@globalsolutions.com', '+1-555-1003', 'Global Solutions', 'new', 'Cold Call', 75000.00, 'Large enterprise, multiple locations'),
('Local Business Co', 'owner@localbiz.com', '+1-555-1004', 'Local Business', 'converted', 'Social Media', 15000.00, 'Signed annual contract'),
('Innovation Labs', 'team@innovationlabs.com', '+1-555-1005', 'Innovation Labs', 'qualified', 'Trade Show', 40000.00, 'R&D focused company'),
('Retail Chain Inc', 'procurement@retailchain.com', '+1-555-1006', 'Retail Chain', 'contacted', 'Email Campaign', 60000.00, 'Multi-store implementation needed'),
('Consulting Group', 'partners@consultinggroup.com', '+1-555-1007', 'Consulting Group', 'lost', 'LinkedIn', 30000.00, 'Went with competitor'),
('Manufacturing Co', 'sales@manufacturing.com', '+1-555-1008', 'Manufacturing Co', 'new', 'Website', 80000.00, 'Complex integration requirements');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  department?: string
  phone?: string
  avatar_url?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  value?: number
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  action: string
  entity_type: string
  entity_id: string
  user_id: string
  user_name: string
  details?: Record<string, any>
  created_at: string
}
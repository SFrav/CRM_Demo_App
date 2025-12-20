import { createClient } from '@/lib/supabase/client'

export interface ActivityLogData {
  action: string
  entityType: 'task' | 'lead' | 'team_member'
  entityId: string
  userName: string
  details?: any
}

export async function logActivity(data: ActivityLogData) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        action: data.action,
        entity_type: data.entityType,
        entity_id: data.entityId,
        user_name: data.userName,
        details: data.details || null
      }])

    if (error) {
      console.error('Error logging activity:', error)
    }
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

// Helper functions for common actions
export const ActivityLogger = {
  taskCreated: (taskId: string, taskTitle: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Task created',
      entityType: 'task',
      entityId: taskId,
      userName,
      details: { title: taskTitle }
    }),

  taskUpdated: (taskId: string, taskTitle: string, changes: any, userName: string = 'Demo User') =>
    logActivity({
      action: 'Task updated',
      entityType: 'task',
      entityId: taskId,
      userName,
      details: { title: taskTitle, changes }
    }),

  taskDeleted: (taskId: string, taskTitle: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Task deleted',
      entityType: 'task',
      entityId: taskId,
      userName,
      details: { title: taskTitle }
    }),

  leadCreated: (leadId: string, leadName: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Lead created',
      entityType: 'lead',
      entityId: leadId,
      userName,
      details: { name: leadName }
    }),

  leadUpdated: (leadId: string, leadName: string, changes: any, userName: string = 'Demo User') =>
    logActivity({
      action: 'Lead updated',
      entityType: 'lead',
      entityId: leadId,
      userName,
      details: { name: leadName, changes }
    }),

  leadDeleted: (leadId: string, leadName: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Lead deleted',
      entityType: 'lead',
      entityId: leadId,
      userName,
      details: { name: leadName }
    }),

  teamMemberCreated: (memberId: string, memberName: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Team member added',
      entityType: 'team_member',
      entityId: memberId,
      userName,
      details: { name: memberName }
    }),

  teamMemberUpdated: (memberId: string, memberName: string, changes: any, userName: string = 'Demo User') =>
    logActivity({
      action: 'Team member updated',
      entityType: 'team_member',
      entityId: memberId,
      userName,
      details: { name: memberName, changes }
    }),

  teamMemberDeleted: (memberId: string, memberName: string, userName: string = 'Demo User') =>
    logActivity({
      action: 'Team member removed',
      entityType: 'team_member',
      entityId: memberId,
      userName,
      details: { name: memberName }
    })
}
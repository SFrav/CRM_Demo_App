'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { Task } from '@/lib/types/database'
import Modal from '@/components/ui/Modal'
import { ActivityLogger } from '@/lib/utils/activity-logger'
import toast from 'react-hot-toast'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  task?: Task
}

interface TaskFormData {
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

export default function TaskForm({ isOpen, onClose, onSuccess, task }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: ''
    }
  })

  // Update form values when task prop changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      })
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: ''
      })
    }
  }, [task, reset])

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true)
    try {
      const taskData = {
        ...data,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null
      }

      if (task) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id)
        
        if (error) throw error
        
        // Log the activity
        await ActivityLogger.taskUpdated(task.id, data.title, {
          status: data.status,
          priority: data.priority,
          due_date: data.due_date
        })
        
        toast.success('Task updated successfully!')
      } else {
        const { data: newTask, error } = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single()
        
        if (error) throw error
        
        // Log the activity
        if (newTask) {
          await ActivityLogger.taskCreated(newTask.id, data.title)
        }
        
        toast.success('Task created successfully!')
      }

      reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error('Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input-field"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field resize-none"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select {...register('priority')} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            {...register('due_date')}
            type="date"
            className="input-field"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
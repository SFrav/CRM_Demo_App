'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/lib/types/database'
import Modal from '@/components/ui/Modal'
import PhoneInput from '@/components/ui/PhoneInput'
import { ActivityLogger } from '@/lib/utils/activity-logger'
import toast from 'react-hot-toast'

interface TeamMemberFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  member?: TeamMember
}

interface TeamMemberFormData {
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: 'active' | 'inactive'
}

const departments = [
  'Sales',
  'Marketing',
  'Engineering',
  'Product',
  'Design',
  'Support',
  'HR',
  'Finance',
  'Operations'
]

const roles = [
  'Manager',
  'Senior Developer',
  'Developer',
  'Designer',
  'Sales Rep',
  'Marketing Specialist',
  'Product Manager',
  'Support Specialist',
  'Analyst',
  'Coordinator'
]

export default function TeamMemberForm({ isOpen, onClose, onSuccess, member }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const supabase = createClient()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TeamMemberFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Sales Rep',
      department: 'Sales',
      status: 'active'
    }
  })

  // Update form values when member prop changes
  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        role: member.role,
        department: member.department || '',
        status: member.status
      })
      setPhone(member.phone || '')
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        role: 'Sales Rep',
        department: 'Sales',
        status: 'active'
      })
      setPhone('')
    }
  }, [member, reset])

  const onSubmit = async (data: TeamMemberFormData) => {
    setLoading(true)
    try {
      const memberData = {
        ...data,
        phone
      }

      if (member) {
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', member.id)
        
        if (error) throw error
        
        // Log the activity
        await ActivityLogger.teamMemberUpdated(member.id, data.name, {
          role: data.role,
          department: data.department,
          status: data.status
        })
        
        toast.success('Team member updated successfully!')
      } else {
        const { data: newMember, error } = await supabase
          .from('team_members')
          .insert([memberData])
          .select()
          .single()
        
        if (error) throw error
        
        // Log the activity
        if (newMember) {
          await ActivityLogger.teamMemberCreated(newMember.id, data.name)
        }
        
        toast.success('Team member added successfully!')
      }

      reset()
      setPhone('')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving team member:', error)
      toast.error('Failed to save team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member ? 'Edit Team Member' : 'Add Team Member'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="input-field"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="input-field"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select {...register('role', { required: 'Role is required' })} className="input-field">
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select {...register('department')} className="input-field">
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select {...register('status')} className="input-field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
            {loading ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
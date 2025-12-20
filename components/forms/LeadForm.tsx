'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { Lead } from '@/lib/types/database'
import Modal from '@/components/ui/Modal'
import PhoneInput from '@/components/ui/PhoneInput'
import { ActivityLogger } from '@/lib/utils/activity-logger'
import toast from 'react-hot-toast'

interface LeadFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lead?: Lead
}

interface LeadFormData {
  name: string
  email: string
  phone: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  value: number
  notes: string
}

const leadSources = [
  'Website',
  'Social Media',
  'Email Campaign',
  'Cold Call',
  'Referral',
  'Trade Show',
  'LinkedIn',
  'Google Ads',
  'Other'
]

export default function LeadForm({ isOpen, onClose, onSuccess, lead }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const supabase = createClient()
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<LeadFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
      source: 'Website',
      value: 0,
      notes: ''
    }
  })

  // Update form values when lead prop changes
  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        source: lead.source,
        value: lead.value || 0,
        notes: lead.notes || ''
      })
      setPhone(lead.phone || '')
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        source: 'Website',
        value: 0,
        notes: ''
      })
      setPhone('')
    }
  }, [lead, reset])

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true)
    try {
      const leadData = {
        ...data,
        phone,
        value: data.value || null
      }

      if (lead) {
        const { error } = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', lead.id)
        
        if (error) throw error
        
        // Log the activity
        await ActivityLogger.leadUpdated(lead.id, data.name, {
          status: data.status,
          company: data.company,
          value: data.value
        })
        
        toast.success('Lead updated successfully!')
      } else {
        const { data: newLead, error } = await supabase
          .from('leads')
          .insert([leadData])
          .select()
          .single()
        
        if (error) throw error
        
        // Log the activity
        if (newLead) {
          await ActivityLogger.leadCreated(newLead.id, data.name)
        }
        
        toast.success('Lead created successfully!')
      }

      reset()
      setPhone('')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving lead:', error)
      toast.error('Failed to save lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead ? 'Edit Lead' : 'Create Lead'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="input-field"
              placeholder="Enter lead name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', {
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

        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              {...register('company')}
              className="input-field"
              placeholder="Enter company name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select {...register('status')} className="input-field">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source *
            </label>
            <select {...register('source', { required: 'Source is required' })} className="input-field">
              {leadSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            {errors.source && (
              <p className="text-red-600 text-sm mt-1">{errors.source.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value ($)
            </label>
            <input
              {...register('value', { 
                valueAsNumber: true,
                min: { value: 0, message: 'Value must be positive' }
              })}
              type="number"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
            {errors.value && (
              <p className="text-red-600 text-sm mt-1">{errors.value.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="input-field resize-none"
            placeholder="Enter any additional notes"
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
            {loading ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
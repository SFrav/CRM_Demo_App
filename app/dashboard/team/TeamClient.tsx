'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TeamMember } from '@/lib/types/database'
import { Plus, Search, Mail, Phone, User, Edit, Trash2 } from 'lucide-react'
import TeamMemberForm from '@/components/forms/TeamMemberForm'
import { ActivityLogger } from '@/lib/utils/activity-logger'
import toast from 'react-hot-toast'

interface Props { initialMembers: TeamMember[] }

export default function TeamPageClient({ initialMembers }: Props) {
  const [members, setMembers]               = useState<TeamMember[]>(initialMembers)
  const [loading, setLoading]               = useState(false)
  const [searchQuery, setSearchQuery]       = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selectedMembers, setSelectedMembers]   = useState<string[]>([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [editingMember, setEditingMember]   = useState<TeamMember | undefined>()
  const supabase = createClient()

  const fetchMembers = async () => {
    try {
      let result
      if (searchQuery) {
        result = await supabase.rpc('search_team_fuzzy', {
          search_term: searchQuery,
          dept_filter: departmentFilter,
        })
      } else {
        let query = supabase
          .from('team_members')
          .select('*')
          .order('created_at', { ascending: false })
        if (departmentFilter !== 'all') {
          query = query.eq('department', departmentFilter)
        }
        result = await query
      }
      const { data, error } = result
      if (error) throw error
      setMembers((data as TeamMember[]) ?? [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchMembers, 300)
    return () => clearTimeout(t)
  }, [searchQuery, departmentFilter])

  const getStatusColor = (status: string) =>
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'

  const handleSelectMember = (id: string) =>
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSelectAll = () =>
    setSelectedMembers(selectedMembers.length === members.length ? [] : members.map(m => m.id))

  const departments = Array.from(
    new Set(members.map(m => m.department).filter(Boolean))
  )

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setShowMemberForm(true)
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      const { data: memberToDelete } = await supabase
        .from('team_members').select('first_name', 'last_name').eq('id', memberId).single()
      const { error } = await supabase.from('team_members').delete().eq('id', memberId)
      if (error) throw error
      if (memberToDelete) {
        const fullName = `${memberToDelete.first_name} ${memberToDelete.last_name}`.trim()
        await ActivityLogger.teamMemberDeleted(memberId, fullName)
      }
      fetchMembers()
      toast.success('Team member deleted successfully')
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast.error('Failed to delete team member')
    }
  }

  const handleFormClose = () => {
    setShowMemberForm(false)
    setEditingMember(undefined)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>
        <button onClick={() => setShowMemberForm(true)} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />Add Member
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>

      {selectedMembers.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-700">
              {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">Export</button>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium">Deactivate</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEditMember(member)} className="text-gray-400 hover:text-primary-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{member.first_name.concat(" ", member.last_name)}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  {member.department && <p className="text-xs text-gray-500">{member.department}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${member.email}`} className="hover:text-primary-600">{member.email}</a>
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${member.phone}`} className="hover:text-primary-600">{member.phone}</a>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Joined {new Date(member.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {members.length > 0 && (
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedMembers.length === members.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
            />
            <span className="text-sm text-gray-600">Select all members</span>
          </label>
          <span className="text-sm text-gray-500">{members.length} total member{members.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {members.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500">Get started by adding your first team member.</p>
        </div>
      )}

      <TeamMemberForm
        isOpen={showMemberForm}
        onClose={handleFormClose}
        onSuccess={fetchMembers}
        member={editingMember}
      />
    </div>
  )
}

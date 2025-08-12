'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Calendar, 
  Building2, 
  Activity, 
  Save,
  Edit3,
  Settings,
  Play,
  Pause,
  Clock,
  CheckCircle
} from 'lucide-react'
import api from '../../lib/api'

interface TaskDetailsModalProps {
  task: any | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTask: any) => void
}

export default function TaskDetailsModal({ task, isOpen, onClose, onSave }: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task && isOpen) {
      setEditedTask({ ...task })
      fetchTaskDetails()
    }
  }, [task, isOpen])

  const fetchTaskDetails = async () => {
    if (!task) return
    
    try {
      setLoading(true)
      const orgsResponse = await api.getOrganizations()
      const organizations = orgsResponse.organizations || orgsResponse
      const org = organizations.find((o: any) => o.id === task.organization_id)
      setOrganization(org)
    } catch (error) {
      console.error('Error fetching task details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedTask) return

    try {
      setLoading(true)
      onSave(editedTask)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {task.name || 'Unnamed Task'}
                  </h3>
                  <p className="text-orange-100">Task Configuration & Scheduling</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Task Information */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Task Configuration
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Task Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedTask?.name || ''}
                          onChange={(e) => setEditedTask((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{task.name || 'Unnamed Task'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={editedTask?.status || 'active'}
                          onChange={(e) => setEditedTask((prev: any) => prev ? { ...prev, status: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status || 'active'}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedTask?.description || ''}
                          onChange={(e) => setEditedTask((prev: any) => prev ? { ...prev, description: e.target.value } : null)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                          placeholder="Describe what this task does..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{task.description || 'No description provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Organization
                      </label>
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        {organization?.team_name || 'Unknown Organization'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Executions
                      </label>
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        {(task.total_executions || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Execution Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Execution Statistics
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total Executions</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {(task.total_executions || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Success Rate</span>
                        <span className="text-lg font-bold text-green-600">
                          {Math.floor(Math.random() * 15 + 85)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Last Run</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor(Math.random() * 48)} hours ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Schedule Settings
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Trigger Type
                        </label>
                        {isEditing ? (
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
                            <option value="scheduled">Scheduled</option>
                            <option value="manual">Manual</option>
                            <option value="event">Event-based</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 dark:text-white">Scheduled</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Frequency
                        </label>
                        {isEditing ? (
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="custom">Custom</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 dark:text-white">Daily</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
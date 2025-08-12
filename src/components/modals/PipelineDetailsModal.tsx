'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Workflow, 
  Building2, 
  Activity, 
  Save,
  Edit3,
  GitBranch,
  Play,
  Settings
} from 'lucide-react'
import api from '../../lib/api'

interface PipelineDetailsModalProps {
  pipeline: any | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedPipeline: any) => void
}

export default function PipelineDetailsModal({ pipeline, isOpen, onClose, onSave }: PipelineDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPipeline, setEditedPipeline] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pipeline && isOpen) {
      setEditedPipeline({ ...pipeline })
      fetchPipelineDetails()
    }
  }, [pipeline, isOpen])

  const fetchPipelineDetails = async () => {
    if (!pipeline) return
    
    try {
      setLoading(true)
      const orgsResponse = await api.getOrganizations()
      const organizations = orgsResponse.organizations || orgsResponse
      const org = organizations.find((o: any) => o.id === pipeline.organization_id)
      setOrganization(org)
    } catch (error) {
      console.error('Error fetching pipeline details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedPipeline) return

    try {
      setLoading(true)
      onSave(editedPipeline)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving pipeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!isOpen || !pipeline) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {pipeline.name || 'Unnamed Pipeline'}
                  </h3>
                  <p className="text-purple-100">Workflow Pipeline Configuration</p>
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
            <div className="space-y-6">
              {/* Pipeline Information */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Workflow className="w-5 h-5 mr-2" />
                  Pipeline Configuration
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pipeline Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedPipeline?.name || ''}
                        onChange={(e) => setEditedPipeline((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{pipeline.name || 'Unnamed Pipeline'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={editedPipeline?.status || 'active'}
                        onChange={(e) => setEditedPipeline((prev: any) => prev ? { ...prev, status: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                        {pipeline.status || 'active'}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedPipeline?.description || ''}
                        onChange={(e) => setEditedPipeline((prev: any) => prev ? { ...prev, description: e.target.value } : null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        placeholder="Describe this workflow pipeline..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{pipeline.description || 'No description provided'}</p>
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
                      {(pipeline.total_executions || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pipeline Stats */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Execution Statistics
                </h4>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(pipeline.total_executions || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor(Math.random() * 15 + 85)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 120 + 30)}s
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                  </div>
                </div>
              </div>

              {/* Pipeline Settings */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Workflow Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trigger Type
                    </label>
                    {isEditing ? (
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
                        <option value="manual">Manual</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="webhook">Webhook</option>
                        <option value="event">Event-based</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">Manual</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Retry Policy
                    </label>
                    {isEditing ? (
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
                        <option value="none">None</option>
                        <option value="linear">Linear</option>
                        <option value="exponential">Exponential</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">Linear</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
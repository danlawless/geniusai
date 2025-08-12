'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  User, 
  Mail, 
  Building2, 
  Calendar, 
  Activity, 
  Bot, 
  Workflow,
  Save,
  Edit3,
  Shield,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react'
import { User as UserType } from '../../types/admin'
import api from '../../lib/api'
import AgentDetailsModal from './AgentDetailsModal'
import TaskDetailsModal from './TaskDetailsModal'
import PipelineDetailsModal from './PipelineDetailsModal'

interface UserDetailsModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: UserType) => void
}

export default function UserDetailsModal({ user, isOpen, onClose, onSave }: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<UserType | null>(null)
  const [userStats, setUserStats] = useState({
    agents: [] as any[],
    tasks: [] as any[],
    pipelines: [] as any[],
    totalInteractions: 0,
    lastActivity: null as string | null
  })
  const [loading, setLoading] = useState(false)
  
  // Detail modal states
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [selectedPipeline, setSelectedPipeline] = useState<any | null>(null)
  const [agentModalOpen, setAgentModalOpen] = useState(false)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setEditedUser({ ...user })
      fetchUserDetails()
    }
  }, [user, isOpen])

  const fetchUserDetails = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const [agents, tasks, pipelines] = await Promise.all([
        api.getAgents(),
        api.getTasks(), 
        api.getPipelines()
      ])

      // Filter data for this user's organization
      const userAgents = agents.filter(a => a.organization_id === user.organization_id)
      const userTasks = tasks.filter(t => t.organization_id === user.organization_id)
      const userPipelines = pipelines.filter(p => p.organization_id === user.organization_id)
      
      const totalInteractions = userAgents.reduce((sum, agent) => sum + (agent.total_interactions || 0), 0)

      setUserStats({
        agents: userAgents,
        tasks: userTasks,
        pipelines: userPipelines,
        totalInteractions,
        lastActivity: user.last_active_at
      })
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedUser) return

    try {
      setLoading(true)
      // Here you would call the API to update the user
      // For now, we'll just simulate the update
      onSave(editedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handlers for opening detail modals
  const handleViewAgent = (agent: any) => {
    setSelectedAgent(agent)
    setAgentModalOpen(true)
  }

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setTaskModalOpen(true)
  }

  const handleViewPipeline = (pipeline: any) => {
    setSelectedPipeline(pipeline)
    setPipelineModalOpen(true)
  }

  // Save handlers for detail modals
  const handleSaveAgent = (updatedAgent: any) => {
    // Update the agent in userStats
    setUserStats(prev => ({
      ...prev,
      agents: prev.agents.map(a => a.id === updatedAgent.id ? updatedAgent : a)
    }))
    setAgentModalOpen(false)
  }

  const handleSaveTask = (updatedTask: any) => {
    // Update the task in userStats
    setUserStats(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }))
    setTaskModalOpen(false)
  }

  const handleSavePipeline = (updatedPipeline: any) => {
    // Update the pipeline in userStats
    setUserStats(prev => ({
      ...prev,
      pipelines: prev.pipelines.map(p => p.id === updatedPipeline.id ? updatedPipeline : p)
    }))
    setPipelineModalOpen(false)
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

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never'
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} days ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} months ago`
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {user.full_name || user.email || 'Unknown User'}
                  </h3>
                  <p className="text-primary-100">User Details & Management</p>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser?.full_name || ''}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{user.full_name || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser?.email || ''}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      {isEditing ? (
                        <select
                          value={editedUser?.role || 'user'}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, role: e.target.value as any } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role || 'user'}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slack User ID
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{user.slack_user_id}</p>
                    </div>
                  </div>
                </div>

                {/* Activity & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Timeline */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Activity Timeline
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Last Active</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {getTimeAgo(user.last_active_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Joined</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Stats */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Resource Usage
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                          <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.agents.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Agents</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2">
                          <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.tasks.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tasks</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
                          <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.pipelines.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pipelines</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg mx-auto mb-2">
                          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.totalInteractions.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Interactions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Agents */}
                {userStats.agents.length > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Bot className="w-5 h-5 mr-2" />
                      Organization Agents ({userStats.agents.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userStats.agents.slice(0, 5).map((agent: any) => (
                        <div key={agent.id} className="flex items-center justify-between p-2 bg-white dark:bg-dark-600 rounded hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</span>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {(agent.total_interactions || 0).toLocaleString()} interactions
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewAgent(agent)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      ))}
                      {userStats.agents.length > 5 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          ...and {userStats.agents.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Tasks */}
                {userStats.tasks.length > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Organization Tasks ({userStats.tasks.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userStats.tasks.slice(0, 5).map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-white dark:bg-dark-600 rounded hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</span>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {(task.total_executions || 0).toLocaleString()} executions • {task.status || 'active'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewTask(task)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      ))}
                      {userStats.tasks.length > 5 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          ...and {userStats.tasks.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Pipelines */}
                {userStats.pipelines.length > 0 && (
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Workflow className="w-5 h-5 mr-2" />
                      Organization Pipelines ({userStats.pipelines.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {userStats.pipelines.slice(0, 5).map((pipeline: any) => (
                        <div key={pipeline.id} className="flex items-center justify-between p-2 bg-white dark:bg-dark-600 rounded hover:bg-gray-50 dark:hover:bg-dark-500 transition-colors">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{pipeline.name}</span>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {(pipeline.total_executions || 0).toLocaleString()} executions • {pipeline.status || 'active'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewPipeline(pipeline)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      ))}
                      {userStats.pipelines.length > 5 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          ...and {userStats.pipelines.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modals */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
        onSave={handleSaveAgent}
      />
      
      <TaskDetailsModal
        task={selectedTask}
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
      />
      
      <PipelineDetailsModal
        pipeline={selectedPipeline}
        isOpen={pipelineModalOpen}
        onClose={() => setPipelineModalOpen(false)}
        onSave={handleSavePipeline}
      />
    </div>
  )
} 
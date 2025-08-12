'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Bot, 
  Building2, 
  Calendar, 
  Activity, 
  TrendingUp,
  Save,
  Edit3,
  Settings,
  BarChart3,
  MessageSquare,
  Clock,
  Hash,
  Cpu,
  Brain,
  Zap,
  Eye,
  Globe,
  Lock,
  Users,
  FileText,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  Palette,
  Code,
  Layers,
  Plus,
  Minus,
  Tag
} from 'lucide-react'
import api from '../../lib/api'

interface AgentDetailsModalProps {
  agent: any | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedAgent: any) => void
}

export default function AgentDetailsModal({ agent, isOpen, onClose, onSave }: AgentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAgent, setEditedAgent] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  // State for capabilities as name/value pairs
  const [capabilityPairs, setCapabilityPairs] = useState<Array<{name: string, value: string}>>([
    { name: '', value: '' },
    { name: '', value: '' },
    { name: '', value: '' }
  ])
  
  // State for settings as name/value pairs
  const [settingsPairs, setSettingsPairs] = useState<Array<{name: string, value: string}>>([
    { name: '', value: '' },
    { name: '', value: '' },
    { name: '', value: '' }
  ])
  
  // State for slack channels - now storing objects with id and name
  const [slackChannels, setSlackChannels] = useState<Array<{id: string, name: string}>>([{id: '', name: ''}])
  
  // State for available Slack channels from API
  const [availableChannels, setAvailableChannels] = useState<Array<{
    id: string
    name: string
    is_private: boolean
    is_member: boolean
    purpose: string
    topic: string
    num_members: number
  }>>([])
  const [channelsLoading, setChannelsLoading] = useState(false)
  
  // State for thread data
  const [threadData, setThreadData] = useState<{
    agent: any
    threads: Array<{
      thread_id: string
      user_id: string
      user_name: string
      slack_user_id: string
      first_interaction: string
      last_interaction: string
      interaction_count: number
    }>
    total_threads: number
    total_users: number
    total_interactions: number
    error?: string
  } | null>(null)
  const [threadsLoading, setThreadsLoading] = useState(false)

  useEffect(() => {
    if (agent && isOpen) {
      setEditedAgent({ ...agent })
      
      // Convert capabilities object to name/value pairs
      const capabilitiesObj = agent.capabilities || {}
      const capabilityArray = Object.entries(capabilitiesObj).map(([name, value]) => ({
        name,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }))
      // Ensure we have at least 3 empty fields
      while (capabilityArray.length < 3) {
        capabilityArray.push({ name: '', value: '' })
      }
      setCapabilityPairs(capabilityArray)
      
      // Convert settings object to name/value pairs
      const settingsObj = agent.settings || {}
      const settingsArray = Object.entries(settingsObj).map(([name, value]) => ({
        name,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }))
      // Ensure we have at least 3 empty fields
      while (settingsArray.length < 3) {
        settingsArray.push({ name: '', value: '' })
      }
      setSettingsPairs(settingsArray)
      
      // Initialize slack channels - handle both old string format and new object format
      const channels = agent.slack_channels && agent.slack_channels.length > 0 
        ? agent.slack_channels.map((channel: any) => {
            // Handle both old string format and new object format
            if (typeof channel === 'string') {
              return { id: '', name: channel }
            }
            return { id: channel.id || '', name: channel.name || channel }
          })
        : [{ id: '', name: '' }]
      setSlackChannels(channels)
      
      fetchAgentDetails()
    }
  }, [agent, isOpen])
  
  // Helper function to convert name/value pairs back to object
  const pairsToObject = (pairs: Array<{name: string, value: string}>) => {
    const obj: any = {}
    pairs.forEach(pair => {
      if (pair.name.trim()) {
        try {
          // Try to parse as JSON first, fallback to string
          obj[pair.name.trim()] = JSON.parse(pair.value)
        } catch {
          obj[pair.name.trim()] = pair.value
        }
      }
    })
    return obj
  }

  const fetchAgentDetails = async () => {
    if (!agent) return
    
    try {
      setLoading(true)
      const orgsResponse = await api.getOrganizations()
      const organizations = orgsResponse.organizations || orgsResponse
      const org = organizations.find((o: any) => o.id === agent.organization_id)
      setOrganization(org)
      
      // Fetch available Slack channels for this organization
      await fetchSlackChannels(agent.organization_id)
      
      // Fetch thread data for this agent
      await fetchAgentThreads(agent.id)
    } catch (error) {
      console.error('Error fetching agent details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlackChannels = async (organizationId: string) => {
    try {
      setChannelsLoading(true)
      const response = await api.getSlackChannels(organizationId)
      
      if (response.error) {
        console.warn('Could not fetch Slack channels:', response.error)
        setAvailableChannels([])
      } else {
        setAvailableChannels(response.channels || [])
      }
    } catch (error) {
      console.error('Error fetching Slack channels:', error)
      setAvailableChannels([])
    } finally {
      setChannelsLoading(false)
    }
  }

  const fetchAgentThreads = async (agentId: string) => {
    try {
      setThreadsLoading(true)
      const response = await api.getAgentThreads(agentId)
      setThreadData(response)
    } catch (error) {
      console.error('Error fetching agent threads:', error)
      setThreadData(null)
    } finally {
      setThreadsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editedAgent) return

    try {
      setLoading(true)
      
      // Convert name/value pairs back to objects
      const updatedAgent = {
        ...editedAgent,
        capabilities: pairsToObject(capabilityPairs),
        settings: pairsToObject(settingsPairs),
        slack_channels: slackChannels.filter(channel => channel.name.trim() !== '')
      }
      
      // Here you would call the API to update the agent
      onSave(updatedAgent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving agent:', error)
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

  if (!isOpen || !agent) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {agent.name || 'Unnamed Agent'}
                  </h3>
                  <p className="text-green-100">AI Agent Configuration & Analytics</p>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Agent Information */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Basic Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Agent Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedAgent?.name || ''}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{agent.name || 'Unnamed Agent'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={editedAgent?.status || 'active'}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, status: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {agent.status || 'active'}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedAgent?.description || ''}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, description: e.target.value } : null)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                          placeholder="Brief description of what this agent does..."
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{agent.description || 'No description provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Visibility
                      </label>
                      {isEditing ? (
                        <select
                          value={editedAgent?.visibility || 'public'}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, visibility: e.target.value } : null)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          {agent.visibility === 'private' ? <Lock className="w-4 h-4 mr-2 text-red-500" /> : <Globe className="w-4 h-4 mr-2 text-green-500" />}
                          <span className="text-gray-900 dark:text-white capitalize">{agent.visibility || 'public'}</span>
                        </div>
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
                  </div>
                </div>

                {/* OpenAI Configuration */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    OpenAI Configuration & Threads
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Assistant ID - Prominent Display */}
                    <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          OpenAI Assistant ID
                        </label>
                        {agent.openai_assistant_id && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            Configured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-5 h-5 text-blue-500" />
                        <p className="text-gray-900 dark:text-white font-mono text-lg font-semibold">
                          {agent.openai_assistant_id || (
                            <span className="text-gray-500 italic">Not configured</span>
                          )}
                        </p>
                        {agent.openai_assistant_id && (
                          <button
                            onClick={() => navigator.clipboard.writeText(agent.openai_assistant_id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Function Calling */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Function Calling
                        </label>
                        {isEditing ? (
                          <button
                            onClick={() => setEditedAgent((prev: any) => prev ? { ...prev, function_calling_enabled: !prev.function_calling_enabled } : null)}
                            className="flex items-center space-x-2"
                          >
                            {editedAgent?.function_calling_enabled ? 
                              <ToggleRight className="w-6 h-6 text-green-500" /> : 
                              <ToggleLeft className="w-6 h-6 text-gray-400" />
                            }
                            <span className="text-sm text-gray-900 dark:text-white">
                              {editedAgent?.function_calling_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {agent.function_calling_enabled ? 
                              <ToggleRight className="w-6 h-6 text-green-500" /> : 
                              <ToggleLeft className="w-6 h-6 text-gray-400" />
                            }
                            <span className="text-sm text-gray-900 dark:text-white">
                              {agent.function_calling_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Energy Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Energy Level
                        </label>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${agent.energy || 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {agent.energy || 100}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thread Analytics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-dark-800 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {threadsLoading ? '...' : threadData?.total_threads || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Active Threads</div>
                      </div>
                      <div className="bg-white dark:bg-dark-800 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {threadsLoading ? '...' : threadData?.total_users || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Unique Users</div>
                      </div>
                      <div className="bg-white dark:bg-dark-800 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {threadsLoading ? '...' : threadData?.total_interactions || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Messages</div>
                      </div>
                    </div>

                    {/* Thread List */}
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Agent ↔ User Threads
                        {threadsLoading && (
                          <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </h5>
                      
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {threadData?.threads && threadData.threads.length > 0 ? (
                          threadData.threads.map((thread, index) => (
                            <div key={`${thread.user_id}-${thread.thread_id}`} className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-200 dark:border-dark-600">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {thread.user_name}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    (@{thread.slack_user_id})
                                  </span>
                                </div>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                  {thread.interaction_count} messages
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Hash className="w-3 h-3" />
                                  <span className="font-mono">{thread.thread_id.slice(0, 12)}...</span>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(thread.thread_id)}
                                    className="p-0.5 hover:text-blue-600 transition-colors"
                                    title="Copy thread ID"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Last: {formatDate(thread.last_interaction)}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : threadsLoading ? (
                          <div className="text-center py-4">
                            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading threads...</p>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No active threads found</p>
                            <p className="text-xs mt-1">Threads will appear here once users interact with this agent</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Prompt & Personality */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Prompt & Personality
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        System Prompt
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedAgent?.prompt || ''}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, prompt: e.target.value } : null)}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white font-mono text-sm"
                          placeholder="Enter the system prompt that defines this agent's behavior and personality..."
                        />
                      ) : (
                        <div className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg p-3">
                          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">
                            {agent.prompt || 'No system prompt configured'}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Persistent Context
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedAgent?.persistent_context || ''}
                          onChange={(e) => setEditedAgent((prev: any) => prev ? { ...prev, persistent_context: e.target.value } : null)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                          placeholder="Context that persists across conversations..."
                        />
                      ) : (
                        <div className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg p-3">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {agent.persistent_context || 'No persistent context configured'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Capabilities & Personality Traits
                      </label>
                      {isEditing ? (
                        <div className="space-y-3">
                          {capabilityPairs.map((pair, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 flex-1">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Name (e.g., personality)"
                                  value={pair.name}
                                  onChange={(e) => {
                                    const newPairs = [...capabilityPairs]
                                    newPairs[index].name = e.target.value
                                    setCapabilityPairs(newPairs)
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Value (e.g., helpful, creative)"
                                value={pair.value}
                                onChange={(e) => {
                                  const newPairs = [...capabilityPairs]
                                  newPairs[index].value = e.target.value
                                  setCapabilityPairs(newPairs)
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
                              />
                              {capabilityPairs.length > 3 && (
                                <button
                                  onClick={() => {
                                    const newPairs = capabilityPairs.filter((_, i) => i !== index)
                                    setCapabilityPairs(newPairs)
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setCapabilityPairs([...capabilityPairs, { name: '', value: '' }])
                            }}
                            className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add More</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg p-3">
                          {Object.keys(agent.capabilities || {}).length > 0 ? (
                            <div className="space-y-2">
                              {Object.entries(agent.capabilities || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <Tag className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No capabilities configured</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slack Integration */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Slack Integration
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Respond to All Messages
                      </label>
                      {isEditing ? (
                        <button
                          onClick={() => setEditedAgent((prev: any) => prev ? { ...prev, respond_to_all_messages: !prev.respond_to_all_messages } : null)}
                          className="flex items-center space-x-2"
                        >
                          {editedAgent?.respond_to_all_messages ? 
                            <ToggleRight className="w-6 h-6 text-green-500" /> : 
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          }
                          <span className="text-sm text-gray-900 dark:text-white">
                            {editedAgent?.respond_to_all_messages ? 'Yes' : 'Only when mentioned'}
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {agent.respond_to_all_messages ? 
                            <ToggleRight className="w-6 h-6 text-green-500" /> : 
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          }
                          <span className="text-sm text-gray-900 dark:text-white">
                            {agent.respond_to_all_messages ? 'Yes' : 'Only when mentioned'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Active Channels
                      </label>
                                                {isEditing ? (
                            <div className="space-y-3">
                              {/* Show available channels if we have them */}
                              {availableChannels.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                      Available Slack Channels ({availableChannels.length})
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                    {availableChannels.slice(0, 10).map((availableChannel) => (
                                      <button
                                        key={availableChannel.id}
                                        onClick={() => {
                                          const exists = slackChannels.some(ch => ch.id === availableChannel.id || ch.name === availableChannel.name)
                                          if (!exists) {
                                            setSlackChannels([...slackChannels, { id: availableChannel.id, name: availableChannel.name }])
                                          }
                                        }}
                                        className="text-left p-2 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded text-xs flex items-center space-x-1"
                                      >
                                        <Hash className="w-3 h-3 text-blue-500" />
                                        <span className="font-medium">{availableChannel.name}</span>
                                        {availableChannel.is_private && <Lock className="w-3 h-3 text-gray-400" />}
                                      </button>
                                    ))}
                                  </div>
                                  {availableChannels.length > 10 && (
                                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                      Showing first 10 channels. Type channel name below to add others.
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Channel input fields */}
                              {slackChannels.map((channel, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1 flex-1">
                                    <Hash className="w-4 h-4 text-blue-500" />
                                    <input
                                      type="text"
                                      placeholder="Channel name (e.g., general, support, dev-team)"
                                      value={channel.name}
                                      onChange={(e) => {
                                        const newChannels = [...slackChannels]
                                        // Try to find matching channel from available channels
                                        const matchingChannel = availableChannels.find(ac => ac.name === e.target.value)
                                        newChannels[index] = { 
                                          id: matchingChannel?.id || '',
                                          name: e.target.value
                                        }
                                        setSlackChannels(newChannels)
                                      }}
                                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
                                      list={`channels-${index}`}
                                    />
                                    <datalist id={`channels-${index}`}>
                                      {availableChannels.map((availableChannel) => (
                                        <option key={availableChannel.id} value={availableChannel.name} />
                                      ))}
                                    </datalist>
                                    {channel.id && (
                                      <span className="text-xs text-green-600 dark:text-green-400 font-mono">
                                        ✓ ID: {channel.id.slice(0, 8)}...
                                      </span>
                                    )}
                                  </div>
                                  {slackChannels.length > 1 && (
                                    <button
                                      onClick={() => {
                                        const newChannels = slackChannels.filter((_, i) => i !== index)
                                        setSlackChannels(newChannels)
                                      }}
                                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  setSlackChannels([...slackChannels, { id: '', name: '' }])
                                }}
                                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Channel</span>
                              </button>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                💡 Pro tip: Click available channels above to add them, or type channel names manually. Channel IDs will be auto-resolved when available.
                              </div>
                              {channelsLoading && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Loading available channels...
                                </div>
                              )}
                            </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {agent.slack_channels?.length || 0} channels configured
                            </span>
                          </div>
                          {agent.slack_channels?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {agent.slack_channels.map((channel: any, index: number) => {
                                // Handle both old string format and new object format
                                const channelName = typeof channel === 'string' ? channel : channel.name || channel.id
                                const channelId = typeof channel === 'object' ? channel.id : ''
                                
                                return (
                                  <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded flex items-center">
                                    <Hash className="w-3 h-3 mr-1" />
                                    <span className="font-medium">{channelName}</span>
                                    {channelId && (
                                      <span className="ml-1 opacity-75 text-xs">({channelId.slice(0, 8)}...)</span>
                                    )}
                                  </span>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No channels configured</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Performance Metrics
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total Interactions</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {(agent.total_interactions || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly Interactions</span>
                        <span className="text-lg font-bold text-blue-600">
                          {(agent.monthly_interactions || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Success Rate</span>
                        <span className="text-lg font-bold text-green-600">
                          {(agent.success_rate || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Activity Timeline
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(agent.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {agent.updated_at ? formatDate(agent.updated_at) : 'Never'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Last Interaction</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {agent.last_interaction_at ? formatDate(agent.last_interaction_at) : 'No interactions yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Advanced Settings
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Configuration Settings
                      </label>
                      {isEditing ? (
                        <div className="space-y-3">
                          {settingsPairs.map((pair, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 flex-1">
                                <Settings className="w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Setting name (e.g., max_tokens)"
                                  value={pair.name}
                                  onChange={(e) => {
                                    const newPairs = [...settingsPairs]
                                    newPairs[index].name = e.target.value
                                    setSettingsPairs(newPairs)
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Value (e.g., 1000)"
                                value={pair.value}
                                onChange={(e) => {
                                  const newPairs = [...settingsPairs]
                                  newPairs[index].value = e.target.value
                                  setSettingsPairs(newPairs)
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm"
                              />
                              {settingsPairs.length > 3 && (
                                <button
                                  onClick={() => {
                                    const newPairs = settingsPairs.filter((_, i) => i !== index)
                                    setSettingsPairs(newPairs)
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setSettingsPairs([...settingsPairs, { name: '', value: '' }])
                            }}
                            className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add More</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg p-3">
                          {Object.keys(agent.settings || {}).length > 0 ? (
                            <div className="space-y-2">
                              {Object.entries(agent.settings || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <Settings className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{key}:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No settings configured</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Agent ID
                        </label>
                        <p className="text-gray-900 dark:text-white font-mono text-xs bg-white dark:bg-dark-800 p-2 rounded border">
                          {agent.id}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Created By
                        </label>
                        <p className="text-gray-900 dark:text-white text-sm">
                          {agent.created_by || 'System'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Summary
                        </label>
                        <p className="text-gray-900 dark:text-white text-sm">
                          {agent.summary || 'No summary available'}
                        </p>
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
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
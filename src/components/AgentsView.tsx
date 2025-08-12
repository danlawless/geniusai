'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, 
  Building2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye,
  Activity,
  Calendar,
  Settings,
  Zap,
  Hash,
  MessageCircle,
  ToggleLeft,
  ToggleRight,
  FileText,
  Clock,
  TrendingDown,
  Target,
  Globe,
  Lock,
  Users,
  Layers,
  Palette,
  Code,
  Play,
  Square,
  Edit,
  MoreVertical
} from 'lucide-react'
import api from '../lib/api'
import AgentDetailsModal from './modals/AgentDetailsModal'
import ViewToggle from './ViewToggle'

export default function AgentsView() {
  const [agents, setAgents] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [agentsData, orgsData] = await Promise.all([
        api.getAgents(),
        api.getOrganizations()
      ])
      
      setAgents(agentsData)
      setOrganizations(orgsData.organizations || orgsData)
    } catch (error) {
      console.error('Error fetching agents data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (agent: any) => {
    setSelectedAgent(agent)
    setIsModalOpen(true)
  }

  const handleSaveAgent = (updatedAgent: any) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      )
    )
    setIsModalOpen(false)
  }

  const handleToggleStatus = async (agent: any) => {
    try {
      const newStatus = agent.status === 'active' ? 'paused' : 'active'
      
      // Optimistically update the UI
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agent.id ? { ...a, status: newStatus } : a
        )
      )
      
      // TODO: Call API to update agent status
      console.log(`Toggling agent ${agent.name} to ${newStatus}`)
      
    } catch (error) {
      console.error('Error toggling agent status:', error)
      // Revert on error
      setAgents(prevAgents => 
        prevAgents.map(a => 
          a.id === agent.id ? { ...a, status: agent.status } : a
        )
      )
    }
  }

  const getOrganizationName = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId)
    return org?.team_name || 'Unknown Organization'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      (agent.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOrganizationName(agent.organization_id).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bot className="w-8 h-8 mr-3 text-primary-600" />
              AI Agents
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all AI agents across organizations
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{agents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.reduce((sum, a) => sum + (a.total_interactions || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(agents.map(a => a.organization_id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents, descriptions, or organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <ViewToggle 
              view={viewMode} 
              onViewChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* Agents Views */}
      {viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            {/* Header Section */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    agent.status === 'active' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                    agent.status === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-gray-500 to-red-500'
                  }`}>
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                      {agent.name || 'Unnamed Agent'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status || 'active'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getOrganizationName(agent.organization_id)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDetails(agent)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(agent)}
                    className={`p-2 rounded-lg transition-colors ${
                      agent.status === 'active' 
                        ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                  >
                    {agent.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="relative">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="More actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Configuration Status Grid */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {/* System Prompt */}
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className={`p-1 rounded ${agent.prompt ? 'text-green-600 bg-green-100 dark:bg-green-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Prompt</span>
                </div>

                {/* Capabilities */}
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className={`p-1 rounded ${Object.keys(agent.capabilities || {}).length > 0 ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                    <Palette className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{Object.keys(agent.capabilities || {}).length}</span>
                </div>

                {/* Settings */}
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className={`p-1 rounded ${Object.keys(agent.settings || {}).length > 0 ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{Object.keys(agent.settings || {}).length}</span>
                </div>

                {/* Channels */}
                <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className={`p-1 rounded ${agent.slack_channels?.length > 0 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{agent.slack_channels?.length || 0}</span>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Function Calling */}
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${agent.function_calling_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {agent.function_calling_enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Functions</span>
                  </div>

                  {/* Auto Response */}
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${agent.respond_to_all_messages ? 'text-green-600' : 'text-gray-400'}`}>
                      {agent.respond_to_all_messages ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Auto</span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center space-x-1">
                    <div className={`p-1 rounded ${agent.visibility === 'public' ? 'text-blue-600' : 'text-gray-600'}`}>
                      {agent.visibility === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{agent.visibility || 'public'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-700 rounded-b-xl border-t border-gray-100 dark:border-dark-600">
              <div className="grid grid-cols-3 gap-4">
                {/* Energy Level */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Zap className={`w-4 h-4 ${(agent.energy || 100) > 70 ? 'text-green-500' : (agent.energy || 100) > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{agent.energy || 100}%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Energy</span>
                </div>

                {/* Success Rate */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Target className={`w-4 h-4 ${(agent.success_rate || 0) > 80 ? 'text-green-500' : (agent.success_rate || 0) > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(agent.success_rate || 0)}%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Success</span>
                </div>

                {/* Total Interactions */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {(agent.total_interactions || 0) > 999 ? `${Math.round((agent.total_interactions || 0) / 1000)}k` : (agent.total_interactions || 0)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Chats</span>
                </div>
              </div>

              {/* Last Activity */}
              {agent.last_interaction_at && (
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200 dark:border-dark-600">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last active {formatDate(agent.last_interaction_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
            ) : (
        /* Table List View */
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Configuration</th>
                  <th>Performance</th>
                  <th>Organization</th>
                  <th>OpenAI</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 ${
                          agent.status === 'active' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                          agent.status === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-gray-500 to-red-500'
                        }`}>
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {agent.name || 'Unnamed Agent'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            {agent.prompt && <span title="Has prompt"><FileText className="w-3 h-3 text-green-600" /></span>}
                            {agent.function_calling_enabled && <span title="Functions enabled"><Code className="w-3 h-3 text-blue-600" /></span>}
                            {agent.respond_to_all_messages && <span title="Auto-response"><MessageCircle className="w-3 h-3 text-purple-600" /></span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        {agent.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <Palette className="w-4 h-4 text-purple-500 mr-1" />
                          <span>{Object.keys(agent.capabilities || {}).length}</span>
                        </div>
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{Object.keys(agent.settings || {}).length}</span>
                        </div>
                        <div className="flex items-center">
                          <Hash className="w-4 h-4 text-orange-500 mr-1" />
                          <span>{agent.slack_channels?.length || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Zap className={`w-4 h-4 mr-1 ${(agent.energy || 100) > 70 ? 'text-green-500' : (agent.energy || 100) > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span className="font-medium">{agent.energy || 100}% Energy</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Target className={`w-4 h-4 mr-1 ${(agent.success_rate || 0) > 80 ? 'text-green-500' : (agent.success_rate || 0) > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span>{Math.round(agent.success_rate || 0)}% Success</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getOrganizationName(agent.organization_id)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          {(agent.total_interactions || 0).toLocaleString()} chats
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {agent.openai_assistant_id ? (
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white font-mono">
                              {agent.openai_assistant_id.slice(0, 12)}...
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              ✓ Configured
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic">Not configured</span>
                        )}
                      </div>
                    </td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">
                      {agent.last_interaction_at ? (
                        <div>
                          <div>{formatDate(agent.last_interaction_at)}</div>
                          <div className="text-xs">Last interaction</div>
                        </div>
                      ) : (
                        <span className="italic">Never</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(agent)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(agent)}
                          className={`p-2 rounded-lg transition-colors ${
                            agent.status === 'active' 
                              ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                        >
                          {agent.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div className="relative">
                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="More actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No agents found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Agent Details Modal */}
      <AgentDetailsModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAgent}
      />
    </div>
  )
} 
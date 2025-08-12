'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Bot, 
  Calendar, 
  Workflow, 
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  UserCheck,
  Activity,
  Play,
  Square,
  Edit,
  MoreVertical
} from 'lucide-react'
import api from '../lib/api'
import { User } from '../types/admin'
import UserDetailsModal from './modals/UserDetailsModal'
import ViewToggle from './ViewToggle'

interface UserStats {
  agents: number
  tasks: number
  pipelines: number
  totalInteractions: number
}

export default function UsersView() {
  const [users, setUsers] = useState<User[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [pipelines, setPipelines] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersData, agentsData, tasksData, pipelinesData, orgsData] = await Promise.all([
        api.getUsers(),
        api.getAgents(),
        api.getTasks(),
        api.getPipelines(),
        api.getOrganizations()
      ])
      
      setUsers(usersData)
      setAgents(agentsData)
      setTasks(tasksData)
      setPipelines(pipelinesData)
      setOrganizations(orgsData.organizations || orgsData)
    } catch (error) {
      console.error('Error fetching users data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveUser = (updatedUser: User) => {
    // Update the user in the local state
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    )
    setIsModalOpen(false)
  }

  const handleToggleStatus = async (user: User) => {
    // TODO: Implement user status toggle when API endpoint is available
    console.log(`Toggle status for user ${user.full_name}`)
  }

  const getUserStats = (userId: string, organizationId: string): UserStats => {
    const userAgents = agents.filter(agent => agent.organization_id === organizationId)
    const userTasks = tasks.filter(task => task.organization_id === organizationId)
    const userPipelines = pipelines.filter(pipeline => pipeline.organization_id === organizationId)
    
    const totalInteractions = userAgents.reduce((sum, agent) => sum + (agent.total_interactions || 0), 0)

    return {
      agents: userAgents.length,
      tasks: userTasks.length,
      pipelines: userPipelines.length,
      totalInteractions
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

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never'
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d ago`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}mo ago`
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOrganizationName(user.organization_id).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    
    return matchesSearch && matchesRole
  })

  const totalStats = {
    totalUsers: users.length,
    totalAgents: agents.length,
    totalTasks: tasks.length,
    totalPipelines: pipelines.length,
    totalInteractions: agents.reduce((sum, agent) => sum + (agent.total_interactions || 0), 0)
  }

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
              <Users className="w-8 h-8 mr-3 text-primary-600" />
              Users Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive user overview with activity stats across all categories
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <ViewToggle 
              view={viewMode} 
              onViewChange={setViewMode} 
            />
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalAgents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Workflow className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pipelines</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalPipelines}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalInteractions.toLocaleString()}</p>
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
              placeholder="Search users, emails, or organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
          const stats = getUserStats(user.id, user.organization_id)
          
          return (
            <div key={user.id} className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                {/* User Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.full_name || user.email || 'Unknown User'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email || 'No email'}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {getOrganizationName(user.organization_id)}
                      </div>
                      <div className="flex items-center">
                        <UserCheck className="w-4 h-4 mr-1" />
                        Joined {formatDate(user.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        Last active {getTimeAgo(user.last_active_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDetails(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(user)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Toggle Status"
                  >
                    <Play className="w-4 h-4" />
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2">
                    <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.agents}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Agents</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tasks}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2">
                    <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pipelines}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pipelines</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInteractions.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interactions</p>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Performance</th>
                <th>Organization</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id, user.organization_id)
                
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.full_name || user.email || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email || 'No email'}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role || 'user'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                                             <div className="text-sm text-gray-900 dark:text-white font-medium">
                         Free
                       </div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">
                         Current plan
                       </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.totalInteractions} interactions
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{stats.agents} agents</span>
                          <span>{stats.tasks} tasks</span>
                          <span>{stats.pipelines} pipelines</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getOrganizationName(user.organization_id)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getTimeAgo(user.last_active_at)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last active
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Toggle Status"
                        >
                          <Play className="w-4 h-4" />
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
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  )
} 
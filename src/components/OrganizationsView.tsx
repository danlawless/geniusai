'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Bot, 
  Calendar, 
  Workflow, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Shield
} from 'lucide-react'
import { Organization } from '@/types/admin'
import adminAPI from '@/lib/api'
import ViewToggle from './ViewToggle'

interface StatusBadgeProps {
  status: 'active' | 'suspended' | 'cancelled'
}

function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    active: {
      icon: CheckCircle,
      className: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
      label: 'Active'
    },
    suspended: {
      icon: AlertTriangle,
      className: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
      label: 'Suspended'
    },
    cancelled: {
      icon: XCircle,
      className: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
      label: 'Cancelled'
    }
  }

  const config = configs[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export default function OrganizationsView() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await adminAPI.getOrganizations({
        page: 1,
        limit: 100,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter
      })
      
      setOrganizations(response.organizations)
    } catch (err: any) {
      console.error('Error fetching organizations:', err)
      setError(err.message)
      
      // Mock data for demo
      setOrganizations([
        {
          id: '1',
          slack_team_id: 'T12345',
          team_name: 'Acme Corporation',
          domain: 'acme.com',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:20:00Z',
          settings: {},
          billing_email: 'billing@acme.com',
          installed_at: '2024-01-15T10:30:00Z',
          monthly_ai_requests: 1240,
          monthly_agent_executions: 89,
          monthly_task_executions: 156,
          last_usage_reset: '2024-01-01',
          user_count: 12,
          agent_count: 8,
          task_count: 15,
          pipeline_count: 4,
          health_status: 'healthy'
        },
        {
          id: '2',
          slack_team_id: 'T67890',
          team_name: 'TechStart Inc',
          domain: 'techstart.io',
          status: 'active',
          created_at: '2024-01-10T09:15:00Z',
          updated_at: '2024-01-18T16:45:00Z',
          settings: {},
          billing_email: 'admin@techstart.io',
          installed_at: '2024-01-10T09:15:00Z',
          monthly_ai_requests: 890,
          monthly_agent_executions: 67,
          monthly_task_executions: 98,
          last_usage_reset: '2024-01-01',
          user_count: 8,
          agent_count: 5,
          task_count: 12,
          pipeline_count: 2,
          health_status: 'healthy'
        },
        {
          id: '3',
          slack_team_id: 'T11111',
          team_name: 'Global Solutions',
          domain: 'globalsolutions.com',
          status: 'suspended',
          created_at: '2024-01-08T14:20:00Z',
          updated_at: '2024-01-22T11:30:00Z',
          settings: {},
          billing_email: 'billing@globalsolutions.com',
          installed_at: '2024-01-08T14:20:00Z',
          monthly_ai_requests: 2450,
          monthly_agent_executions: 189,
          monthly_task_executions: 267,
          last_usage_reset: '2024-01-01',
          user_count: 25,
          agent_count: 18,
          task_count: 32,
          pipeline_count: 8,
          health_status: 'warning'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (org: Organization) => {
    setSelectedOrg(org)
    setIsModalOpen(true)
  }

  const handleEdit = (org: Organization) => {
    setSelectedOrg(org)
    setIsModalOpen(true)
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
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getHealthColor = (health: string) => {
    switch (health?.toLowerCase()) {
      case 'healthy': return 'bg-green-400'
      case 'warning': return 'bg-yellow-400'
      case 'critical': return 'bg-red-400'
      default: return 'bg-green-400'
    }
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slack_team_id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter
    
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
              <Building2 className="w-8 h-8 mr-3 text-primary-600" />
              Organizations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor all client organizations
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Organizations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{organizations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizations.filter(o => o.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizations.reduce((sum, o) => sum + (o.user_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organizations.reduce((sum, o) => sum + (o.monthly_ai_requests || 0), 0).toLocaleString()}
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
              placeholder="Search organizations, domains, or team IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <ViewToggle 
              view={viewMode} 
              onViewChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* Organizations Views */}
      {viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              {/* Header Section */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                        {org.team_name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                          {org.status}
                        </span>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-1 ${getHealthColor(org.health_status || 'healthy')}`} />
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {org.health_status || 'healthy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDetails(org)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(org)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
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

                {/* Organization Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{org.domain || 'No domain'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>{org.slack_team_id}</span>
                  </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="p-1 rounded text-blue-600 bg-blue-100 dark:bg-blue-900/20">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{org.user_count || 0}</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="p-1 rounded text-purple-600 bg-purple-100 dark:bg-purple-900/20">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{org.agent_count || 0}</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="p-1 rounded text-green-600 bg-green-100 dark:bg-green-900/20">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{org.task_count || 0}</span>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="p-1 rounded text-orange-600 bg-orange-100 dark:bg-orange-900/20">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{org.pipeline_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-dark-700 rounded-b-xl border-t border-gray-100 dark:border-dark-600">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(org.monthly_ai_requests || 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Requests</span>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(org.monthly_agent_executions || 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Executions</span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200 dark:border-dark-600">
                  <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDate(org.created_at)}
                  </span>
                </div>
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
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Resources</th>
                  <th>Usage</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm mr-3">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {org.team_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {org.slack_team_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={org.status} />
                    </td>
                    <td>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getHealthColor(org.health_status || 'healthy')}`} />
                        <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                          {org.health_status || 'healthy'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{org.user_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Bot className="w-4 h-4 text-purple-500 mr-1" />
                          <span>{org.agent_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-green-500 mr-1" />
                          <span>{org.task_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Workflow className="w-4 h-4 text-orange-500 mr-1" />
                          <span>{org.pipeline_count || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {(org.monthly_ai_requests || 0).toLocaleString()} requests
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {(org.monthly_agent_executions || 0).toLocaleString()} executions
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(org.created_at)}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(org)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(org)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
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

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No organizations found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Simple Modal (placeholder for now) */}
      {isModalOpen && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedOrg.team_name}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Team ID
                  </label>
                  <div className="text-sm text-gray-900 dark:text-white font-mono">
                    {selectedOrg.slack_team_id}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {selectedOrg.domain || 'Not set'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <StatusBadge status={selectedOrg.status} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created
                  </label>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(selectedOrg.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
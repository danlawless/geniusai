'use client'

import { useState, useEffect } from 'react'
import { 
  Workflow, 
  Building2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Pause,
  Eye,
  Activity,
  Clock,
  GitBranch,
  Play,
  Settings,
  Zap,
  Target,
  Users,
  Hash,
  FileText,
  ToggleLeft,
  ToggleRight,
  Layers,
  ArrowRight,
  Square,
  Edit,
  MoreVertical
} from 'lucide-react'
import api from '../lib/api'
import PipelineDetailsModal from './modals/PipelineDetailsModal'
import ViewToggle from './ViewToggle'

export default function PipelinesView() {
  const [pipelines, setPipelines] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPipeline, setSelectedPipeline] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pipelinesData, orgsData] = await Promise.all([
        api.getPipelines(),
        api.getOrganizations()
      ])
      
      setPipelines(pipelinesData)
      setOrganizations(orgsData.organizations || orgsData)
    } catch (error) {
      console.error('Error fetching pipelines data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (pipeline: any) => {
    setSelectedPipeline(pipeline)
    setIsModalOpen(true)
  }

  const handleSavePipeline = (updatedPipeline: any) => {
    setPipelines(prevPipelines =>
      prevPipelines.map(pipeline =>
        pipeline.id === updatedPipeline.id ? updatedPipeline : pipeline
      )
    )
    setIsModalOpen(false)
  }

  const handleToggleStatus = async (pipeline: any) => {
    try {
      const newStatus = pipeline.status === 'active' ? 'paused' : 'active'
      
      // Optimistically update the UI
      setPipelines(prevPipelines => 
        prevPipelines.map(p => 
          p.id === pipeline.id ? { ...p, status: newStatus } : p
        )
      )
      
      // TODO: Call API to update pipeline status
      console.log(`Toggling pipeline ${pipeline.name} to ${newStatus}`)
      
    } catch (error) {
      console.error('Error toggling pipeline status:', error)
      // Revert on error
      setPipelines(prevPipelines => 
        prevPipelines.map(p => 
          p.id === pipeline.id ? { ...p, status: pipeline.status } : p
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

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = 
      (pipeline.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pipeline.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOrganizationName(pipeline.organization_id).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || pipeline.status === selectedStatus
    
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
              <Workflow className="w-8 h-8 mr-3 text-primary-600" />
              Workflow Pipelines
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage all workflow pipelines across organizations
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Workflow className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pipelines</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pipelines.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pipelines.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pipelines.reduce((sum, p) => sum + (p.total_executions || 0), 0).toLocaleString()}
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
                  {new Set(pipelines.map(p => p.organization_id)).size}
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
              placeholder="Search pipelines, descriptions, or organizations..."
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

            {/* Pipelines Views */}
      {viewMode === 'card' ? (
        /* Card View */
        <div className="space-y-4">
          {filteredPipelines.map((pipeline) => (
            <div key={pipeline.id} className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                {/* Pipeline Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {pipeline.name || 'Unnamed Pipeline'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                        {pipeline.status || 'active'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {pipeline.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {getOrganizationName(pipeline.organization_id)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Created {formatDate(pipeline.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        {(pipeline.total_executions || 0).toLocaleString()} executions
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDetails(pipeline)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(pipeline)}
                    className={`p-2 rounded-lg transition-colors ${
                      pipeline.status === 'active' 
                        ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={pipeline.status === 'active' ? 'Pause Pipeline' : 'Activate Pipeline'}
                  >
                    {pipeline.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                  <th>Pipeline</th>
                  <th>Status</th>
                  <th>Steps</th>
                  <th>Performance</th>
                  <th>Organization</th>
                  <th>Last Execution</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPipelines.map((pipeline) => (
                  <tr key={pipeline.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {pipeline.name || 'Unnamed Pipeline'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {pipeline.description ? pipeline.description.slice(0, 40) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                        {pipeline.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <ArrowRight className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{pipeline.steps?.length || 0} steps</span>
                        </div>
                        <div className="flex items-center">
                          <Layers className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="capitalize">{pipeline.type || 'workflow'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Target className={`w-4 h-4 mr-1 ${(pipeline.success_rate || 0) > 80 ? 'text-green-500' : (pipeline.success_rate || 0) > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span className="font-medium">{Math.round(pipeline.success_rate || 0)}% Success</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Activity className="w-4 h-4 mr-1" />
                          <span>{(pipeline.total_executions || 0).toLocaleString()} runs</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getOrganizationName(pipeline.organization_id)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Created {formatDate(pipeline.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">
                      {pipeline.last_execution_at ? (
                        <div>
                          <div>{formatDate(pipeline.last_execution_at)}</div>
                          <div className="text-xs">Last run</div>
                        </div>
                      ) : (
                        <span className="italic">Never executed</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(pipeline)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(pipeline)}
                          className={`p-2 rounded-lg transition-colors ${
                            pipeline.status === 'active' 
                              ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={pipeline.status === 'active' ? 'Pause Pipeline' : 'Activate Pipeline'}
                        >
                          {pipeline.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

      {filteredPipelines.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pipelines found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pipeline Details Modal */}
      <PipelineDetailsModal
        pipeline={selectedPipeline}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePipeline}
      />
    </div>
  )
} 
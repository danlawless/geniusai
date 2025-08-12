'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Building2,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Pause,
  Eye,
  Activity,
  Clock,
  Play,
  RotateCcw,
  Settings,
  Zap,
  Target,
  Users,
  Hash,
  FileText,
  ToggleLeft,
  ToggleRight,
  Layers,
  AlertTriangle,
  Square,
  Edit,
  MoreVertical
} from 'lucide-react'
import api from '../lib/api'
import TaskDetailsModal from './modals/TaskDetailsModal'
import ViewToggle from './ViewToggle'

export default function TasksView() {
  const [tasks, setTasks] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksData, orgsData] = await Promise.all([
        api.getTasks(),
        api.getOrganizations()
      ])
      
      // Enhance tasks with example scheduling data for demonstration
      const enhancedTasks = tasksData.map((task: any, index: number) => {
        const scheduleExamples = [
          // Daily schedule
          {
            frequency: 'daily',
            time_of_day: '09:00',
            timezone: 'EST',
            next_execution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            last_execution_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          // Weekly schedule with specific days
          {
            frequency: 'weekly',
            days_of_week: [1, 2, 3, 4, 5], // Weekdays
            time_of_day: '14:30',
            timezone: 'UTC',
            next_execution: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            last_execution_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          // Monthly schedule
          {
            frequency: 'monthly',
            time_of_day: '08:00',
            timezone: 'PST',
            next_execution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            last_execution_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          // Cron expression
          {
            cron_expression: '0 */4 * * *', // Every 4 hours
            next_execution: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            last_execution_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          // Manual (no schedule)
          {
            last_execution_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        
        const scheduleExample = scheduleExamples[index % scheduleExamples.length]
        return {
          ...task,
          ...scheduleExample,
          // Add other missing fields with defaults
          success_rate: Math.floor(Math.random() * 40 + 60), // 60-100%
          priority: ['high', 'medium', 'low', 'normal'][index % 4],
          auto_retry: index % 3 === 0,
          notifications_enabled: index % 2 === 0,
          type: ['standard', 'webhook', 'data_sync', 'cleanup'][index % 4],
          parameters: index % 2 === 0 ? { url: 'https://api.example.com', timeout: 30 } : {}
        }
      })
      
      setTasks(enhancedTasks)
      setOrganizations(orgsData.organizations || orgsData)
    } catch (error) {
      console.error('Error fetching tasks data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (task: any) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (updatedTask: any) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
    setIsModalOpen(false)
  }

  const handleToggleStatus = async (task: any) => {
    try {
      const newStatus = task.status === 'active' ? 'paused' : 'active'
      
      // Optimistically update the UI
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      )
      
      // TODO: Call API to update task status
      console.log(`Toggling task ${task.name} to ${newStatus}`)
      
    } catch (error) {
      console.error('Error toggling task status:', error)
      // Revert on error
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id ? { ...t, status: task.status } : t
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

  const formatScheduleDetails = (task: any) => {
    if (!task.schedule && !task.frequency) {
      return { type: 'manual', display: 'Manual execution only', details: '' }
    }

    // Handle cron expressions
    if (task.cron_expression) {
      return { type: 'cron', display: 'Custom Schedule', details: task.cron_expression }
    }

    // Handle frequency-based scheduling
    if (task.frequency) {
      const time = task.time_of_day || '09:00'
      const timezone = task.timezone && task.timezone !== 'UTC' ? ` (${task.timezone})` : ''
      
      switch (task.frequency.toLowerCase()) {
        case 'daily':
          return { 
            type: 'daily', 
            display: 'Daily', 
            details: `Every day at ${time}${timezone}` 
          }
        case 'weekly':
          const days = task.days_of_week ? formatWeekDays(task.days_of_week) : 'Every week'
          return { 
            type: 'weekly', 
            display: 'Weekly', 
            details: `${days} at ${time}${timezone}` 
          }
        case 'monthly':
          return { 
            type: 'monthly', 
            display: 'Monthly', 
            details: `Monthly at ${time}${timezone}` 
          }
        case 'hourly':
          return { 
            type: 'hourly', 
            display: 'Hourly', 
            details: 'Every hour' 
          }
        default:
          return { 
            type: 'custom', 
            display: task.frequency, 
            details: task.time_of_day ? `at ${time}${timezone}` : '' 
          }
      }
    }

    // Fallback for basic schedule field
    return { type: 'basic', display: 'Scheduled', details: task.schedule || '' }
  }

  const formatWeekDays = (daysArray: number[]) => {
    if (!Array.isArray(daysArray) || daysArray.length === 0) return 'Every week'
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const sortedDays = [...daysArray].sort()
    
    // Check for common patterns
    if (sortedDays.length === 7) return 'Every day'
    if (sortedDays.length === 5 && sortedDays.every(d => d >= 1 && d <= 5)) return 'Weekdays'
    if (sortedDays.length === 2 && sortedDays.includes(0) && sortedDays.includes(6)) return 'Weekends'
    
    return sortedDays.map(d => dayNames[d]).join(', ')
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      (task.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOrganizationName(task.organization_id).toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    
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
              <Calendar className="w-8 h-8 mr-3 text-primary-600" />
              Scheduled Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage all scheduled tasks across organizations
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasks.filter(t => t.status === 'active').length}
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
                  {tasks.reduce((sum, t) => sum + (t.total_executions || 0), 0).toLocaleString()}
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
                  {new Set(tasks.map(t => t.organization_id)).size}
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
              placeholder="Search tasks, descriptions, or organizations..."
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

      {/* Tasks Views */}
      {viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              {/* Header Section */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      task.status === 'active' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                      task.status === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-gray-500 to-red-500'
                    }`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                        {task.name || 'Unnamed Task'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status || 'active'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getOrganizationName(task.organization_id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDetails(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(task)}
                      className={`p-2 rounded-lg transition-colors ${
                        task.status === 'active' 
                          ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={task.status === 'active' ? 'Pause Task' : 'Activate Task'}
                    >
                      {task.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                  {/* Schedule */}
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    {(() => {
                      const scheduleInfo = formatScheduleDetails(task)
                      return (
                        <>
                          <div className={`p-1 rounded ${scheduleInfo.type !== 'manual' ? 'text-green-600 bg-green-100 dark:bg-green-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                            {scheduleInfo.display}
                          </span>
                        </>
                      )
                    })()}
                  </div>

                  {/* Parameters */}
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className={`p-1 rounded ${Object.keys(task.parameters || {}).length > 0 ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{Object.keys(task.parameters || {}).length}</span>
                  </div>

                  {/* Type */}
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className={`p-1 rounded ${task.type ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.type || 'N/A'}</span>
                  </div>

                  {/* Priority */}
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className={`p-1 rounded ${
                      task.priority === 'high' ? 'text-red-600 bg-red-100 dark:bg-red-900/20' :
                      task.priority === 'medium' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' :
                      task.priority === 'low' ? 'text-green-600 bg-green-100 dark:bg-green-900/20' :
                      'text-gray-400 bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {task.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                       task.priority === 'medium' ? <Target className="w-4 h-4" /> :
                       <Hash className="w-4 h-4" />}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">{task.priority || 'normal'}</span>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Auto Retry */}
                    <div className="flex items-center space-x-1">
                      <div className={`p-1 rounded ${task.auto_retry ? 'text-green-600' : 'text-gray-400'}`}>
                        {task.auto_retry ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Retry</span>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center space-x-1">
                      <div className={`p-1 rounded ${task.notifications_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {task.notifications_enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Notify</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-dark-700 rounded-b-xl border-t border-gray-100 dark:border-dark-600">
                <div className="grid grid-cols-3 gap-4">
                  {/* Success Rate */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Target className={`w-4 h-4 ${(task.success_rate || 0) > 80 ? 'text-green-500' : (task.success_rate || 0) > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(task.success_rate || 0)}%</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Success</span>
                  </div>

                  {/* Total Executions */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(task.total_executions || 0) > 999 ? `${Math.round((task.total_executions || 0) / 1000)}k` : (task.total_executions || 0)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Runs</span>
                  </div>

                  {/* Next Run */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {task.next_execution ? 'Soon' : 'N/A'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Next</span>
                  </div>
                </div>

                {/* Schedule Details & Last Execution */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-600">
                  {(() => {
                    const scheduleInfo = formatScheduleDetails(task)
                    return scheduleInfo.type !== 'manual' && scheduleInfo.details && (
                      <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-center">{scheduleInfo.details}</span>
                      </div>
                    )
                  })()}
                  
                  {task.next_execution && (
                    <div className="flex items-center justify-center text-xs text-blue-600 dark:text-blue-400 mb-2">
                      <Play className="w-3 h-3 mr-1" />
                      <span>Next: {formatDate(task.next_execution)}</span>
                    </div>
                  )}
                  
                  {task.last_execution_at && (
                    <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      <span>Last run {formatDate(task.last_execution_at)}</span>
                    </div>
                  )}
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
                  <th>Task</th>
                  <th>Status</th>
                  <th>Schedule</th>
                  <th>Configuration</th>
                  <th>Performance</th>
                  <th>Organization</th>
                  <th>Last Execution</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3 ${
                          task.status === 'active' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                          task.status === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-gray-500 to-red-500'
                        }`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {task.name || 'Unnamed Task'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            {task.auto_retry && <span title="Auto-retry enabled"><RotateCcw className="w-3 h-3 text-green-600" /></span>}
                            {task.notifications_enabled && <span title="Notifications enabled"><Users className="w-3 h-3 text-blue-600" /></span>}
                            <span className="capitalize">{task.priority || 'normal'} priority</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        {(() => {
                          const scheduleInfo = formatScheduleDetails(task)
                          return scheduleInfo.type === 'manual' ? (
                            <span className="text-gray-500 dark:text-gray-400 italic">Manual</span>
                          ) : (
                            <div>
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="font-medium">{scheduleInfo.display}</span>
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                {scheduleInfo.details}
                              </div>
                              {task.next_execution && (
                                <div className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                                  Next: {formatDate(task.next_execution)}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{Object.keys(task.parameters || {}).length}</span>
                        </div>
                        <div className="flex items-center">
                          <Layers className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="capitalize">{task.type || 'standard'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Target className={`w-4 h-4 mr-1 ${(task.success_rate || 0) > 80 ? 'text-green-500' : (task.success_rate || 0) > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                          <span className="font-medium">{Math.round(task.success_rate || 0)}% Success</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Activity className="w-4 h-4 mr-1" />
                          <span>{(task.total_executions || 0).toLocaleString()} runs</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getOrganizationName(task.organization_id)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Created {formatDate(task.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">
                      {task.last_execution_at ? (
                        <div>
                          <div>{formatDate(task.last_execution_at)}</div>
                          <div className="text-xs">Last run</div>
                        </div>
                      ) : (
                        <span className="italic">Never executed</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(task)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(task)}
                          className={`p-2 rounded-lg transition-colors ${
                            task.status === 'active' 
                              ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          title={task.status === 'active' ? 'Pause Task' : 'Activate Task'}
                        >
                          {task.status === 'active' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  )
} 
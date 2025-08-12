'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Bot, 
  Calendar, 
  Workflow, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Zap,
  Shield,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { DashboardMetrics } from '@/types/admin'
import adminAPI from '@/lib/api'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: any
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  loading?: boolean
  onClick?: () => void
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, color, loading, onClick }: MetricCardProps) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-white',
    secondary: 'from-secondary-500 to-secondary-600 text-white',
    success: 'from-success-500 to-success-600 text-white',
    warning: 'from-warning-500 to-warning-600 text-white',
    danger: 'from-danger-500 to-danger-600 text-white'
  }

  if (loading) {
    return (
      <div className="admin-card animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`admin-card hover:scale-105 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change !== undefined && (
              <div className={`flex items-center text-sm font-medium ${
                change >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          {changeLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {changeLabel}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

interface DashboardOverviewProps {
  onNavigate?: (view: string) => void
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps = {}) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError('')
      const data = await adminAPI.getDashboardOverview()
      setMetrics(data)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
      // Use mock data for demo
      setMetrics({
        organizations: {
          total: 47,
          active: 42,
          suspended: 3,
          cancelled: 2,
          growth_rate: 12.5
        },
        users: {
          total: 186,
          active: 164,
          new_this_month: 23,
          growth_rate: 18.3
        },
        resources: {
          total_agents: 89,
          active_agents: 81,
          total_tasks: 156,
          active_tasks: 142,
          total_pipelines: 34,
          active_pipelines: 31
        },
        revenue: {
          monthly_recurring: 12750,
          annual_recurring: 153000,
          growth_rate: 24.7,
          churn_rate: 3.2
        },
        usage: {
          total_ai_requests: 45680,
          total_executions: 8934,
          average_response_time: 1240,
          success_rate: 98.7
        },
        health: {
          system_status: 'healthy',
          database_health: 99.2,
          api_health: 98.9,
          uptime: 99.8
        }
      })
    } finally {
      setLoading(false)
    }
  }

  if (error && !metrics) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-danger-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to load dashboard data
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error}
        </p>
        <button
          onClick={fetchDashboardData}
          className="admin-button-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to GeniusAI Command Center
            </h1>
            <p className="text-primary-100 text-lg">
              Your complete platform overview and analytics dashboard
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-primary-200">Last updated</p>
              <p className="font-medium">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Organizations"
          value={metrics?.organizations.total || 0}
          change={metrics?.organizations.growth_rate}
          changeLabel="vs last month"
          icon={Building2}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Active Users"
          value={metrics?.users.active || 0}
          change={metrics?.users.growth_rate}
          changeLabel="vs last month"
          icon={Users}
          color="success"
          loading={loading}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${(metrics?.revenue.monthly_recurring || 0).toLocaleString()}`}
          change={metrics?.revenue.growth_rate}
          changeLabel="vs last month"
          icon={DollarSign}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="System Health"
          value={`${metrics?.health.uptime || 0}%`}
          change={0.2}
          changeLabel="uptime"
          icon={Shield}
          color="success"
          loading={loading}
        />
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="AI Agents"
          value={`${metrics?.resources.active_agents || 0}/${metrics?.resources.total_agents || 0}`}
          icon={Bot}
          color="secondary"
          loading={loading}
          onClick={() => onNavigate?.('agents')}
        />
        <MetricCard
          title="Scheduled Tasks"
          value={`${metrics?.resources.active_tasks || 0}/${metrics?.resources.total_tasks || 0}`}
          icon={Calendar}
          color="primary"
          loading={loading}
          onClick={() => onNavigate?.('tasks')}
        />
        <MetricCard
          title="Active Pipelines"
          value={`${metrics?.resources.active_pipelines || 0}/${metrics?.resources.total_pipelines || 0}`}
          icon={Workflow}
          color="success"
          loading={loading}
          onClick={() => onNavigate?.('pipelines')}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform Performance
            </h3>
            <Zap className="w-5 h-5 text-warning-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </span>
              <span className="text-lg font-bold text-success-600">
                {metrics?.usage.success_rate || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                style={{ width: `${metrics?.usage.success_rate || 0}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Response Time
              </span>
              <span className="text-lg font-bold text-primary-600">
                {metrics?.usage.average_response_time || 0}ms
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Requests
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {(metrics?.usage.total_ai_requests || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h3>
            <TrendingUp className="w-5 h-5 text-success-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Recurring Revenue
              </span>
              <span className="text-lg font-bold text-success-600">
                ${(metrics?.revenue.monthly_recurring || 0).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Annual Recurring Revenue
              </span>
              <span className="text-lg font-bold text-primary-600">
                ${(metrics?.revenue.annual_recurring || 0).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Churn Rate
              </span>
              <span className="text-lg font-bold text-danger-600">
                {metrics?.revenue.churn_rate || 0}%
              </span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-success-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">
                  +{metrics?.revenue.growth_rate || 0}% growth this month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
            <Building2 className="w-5 h-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Manage Organizations
            </span>
          </button>
          <button className="flex items-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors">
            <Shield className="w-5 h-5 text-success-600 mr-3" />
            <span className="text-sm font-medium text-success-700 dark:text-success-300">
              System Health
            </span>
          </button>
          <button className="flex items-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors">
            <TrendingUp className="w-5 h-5 text-warning-600 mr-3" />
            <span className="text-sm font-medium text-warning-700 dark:text-warning-300">
              View Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  )
} 
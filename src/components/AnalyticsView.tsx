'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  Target,
  Zap
} from 'lucide-react'
import { Analytics } from '@/types/admin'
import adminAPI from '@/lib/api'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: any
  color: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="admin-card hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {changeType === 'increase' ? 
                <ArrowUp className="w-4 h-4 mr-1" /> : 
                <ArrowDown className="w-4 h-4 mr-1" />
              }
              <span>{Math.abs(change)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminAPI.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
      
      // Mock data for demo
      setAnalytics({
        timeRange,
        signups: {
          total: 156,
          data: [
            { date: '2024-01-01', count: 12 },
            { date: '2024-01-02', count: 8 },
            { date: '2024-01-03', count: 15 },
            { date: '2024-01-04', count: 22 },
            { date: '2024-01-05', count: 18 },
            { date: '2024-01-06', count: 25 },
            { date: '2024-01-07', count: 32 }
          ],
          growth_rate: 24.5
        },
        revenue: {
          total: 45250,
          data: [
            { date: '2024-01-01', amount: 1250 },
            { date: '2024-01-02', amount: 1450 },
            { date: '2024-01-03', amount: 1680 },
            { date: '2024-01-04', amount: 1820 },
            { date: '2024-01-05', amount: 1950 },
            { date: '2024-01-06', amount: 2100 },
            { date: '2024-01-07', amount: 2200 }
          ],
          growth_rate: 18.7
        },
        engagement: {
          daily_active_users: 89,
          monthly_active_users: 234,
          average_session_time: 24.5,
          feature_adoption: [
            { feature: 'AI Agents', adoption_rate: 87.5 },
            { feature: 'Task Scheduler', adoption_rate: 72.3 },
            { feature: 'Pipelines', adoption_rate: 45.8 },
            { feature: 'Analytics', adoption_rate: 34.2 }
          ]
        },
        performance: {
          average_response_time: 145,
          success_rate: 99.2,
          error_rate: 0.8,
          uptime: 99.9
        }
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track growth, engagement, and platform performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="admin-input w-auto"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <button className="admin-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="New Signups"
          value={analytics?.signups.total || 0}
          change={analytics?.signups.growth_rate}
          changeType="increase"
          icon={Users}
          color="bg-gradient-to-r from-primary-500 to-primary-600"
        />
        <MetricCard
          title="Revenue"
          value={`$${(analytics?.revenue.total || 0).toLocaleString()}`}
          change={analytics?.revenue.growth_rate}
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-r from-success-500 to-success-600"
        />
        <MetricCard
          title="Active Users"
          value={analytics?.engagement.daily_active_users || 0}
          change={15.2}
          changeType="increase"
          icon={Target}
          color="bg-gradient-to-r from-secondary-500 to-secondary-600"
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics?.performance.success_rate || 0}%`}
          change={analytics?.performance.success_rate ? 0.5 : 0}
          changeType="increase"
          icon={Zap}
          color="bg-gradient-to-r from-warning-500 to-warning-600"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup Trends */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Signup Trends
            </h3>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Growth Rate
              </span>
              <span className="text-lg font-bold text-success-600">
                +{analytics?.signups.growth_rate || 0}%
              </span>
            </div>
            
            {/* Simple chart representation */}
            <div className="space-y-2">
              {analytics?.signups.data.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      style={{ width: `${(item.count / 35) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white w-8">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Growth
            </h3>
            <DollarSign className="w-5 h-5 text-success-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Growth Rate
              </span>
              <span className="text-lg font-bold text-success-600">
                +{analytics?.revenue.growth_rate || 0}%
              </span>
            </div>
            
            {/* Simple chart representation */}
            <div className="space-y-2">
              {analytics?.revenue.data.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-success-500 to-success-600 rounded-full"
                      style={{ width: `${(item.amount / 2500) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white w-12">
                    ${item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Adoption and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Adoption */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Feature Adoption
            </h3>
            <BarChart3 className="w-5 h-5 text-secondary-500" />
          </div>
          
          <div className="space-y-4">
            {analytics?.engagement.feature_adoption.map((feature, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {feature.feature}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {feature.adoption_rate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                      index === 1 ? 'bg-gradient-to-r from-success-500 to-success-600' :
                      index === 2 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                      'bg-gradient-to-r from-secondary-500 to-secondary-600'
                    }`}
                    style={{ width: `${feature.adoption_rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Engagement
            </h3>
            <Users className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Daily Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.engagement.daily_active_users || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Active
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics?.engagement.monthly_active_users || 0}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Session Time
                </span>
                <span className="text-lg font-bold text-primary-600">
                  {analytics?.engagement.average_session_time || 0} min
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  User Retention
                </span>
                <span className="text-lg font-bold text-success-600">
                  82.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Platform Performance
          </h3>
          <Zap className="w-5 h-5 text-warning-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {analytics?.performance.average_response_time || 0}ms
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Avg Response Time
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
              {analytics?.performance.success_rate || 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Success Rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-danger-600 dark:text-danger-400 mb-2">
              {analytics?.performance.error_rate || 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Error Rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">
              {analytics?.performance.uptime || 0}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights & Recommendations
          </h3>
          <Target className="w-5 h-5 text-secondary-500" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
            <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success-800 dark:text-success-200">
                Strong growth momentum detected
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                Your signup rate has increased by 24.5% this month. Consider increasing marketing spend during this growth phase.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
            <Target className="w-5 h-5 text-warning-600 dark:text-warning-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
                Pipeline feature needs attention
              </p>
              <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                Only 45.8% adoption rate for Pipelines. Consider improving onboarding or simplifying the interface.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                Excellent system performance
              </p>
              <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                99.2% success rate and 145ms average response time indicate healthy system performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
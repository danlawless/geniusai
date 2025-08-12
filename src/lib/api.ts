/**
 * API Client for GeniusAI Admin Dashboard
 * Handles all communication with the backend services
 */

import { 
  Organization, 
  DashboardMetrics, 
  SystemHealth, 
  Analytics,
  User,
  Agent,
  Task,
  Pipeline,
  SubscriptionPlan,
  AuditLog
} from '@/types/admin'

import { mockData } from './mock-data'

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://geniusai-v2-worker.dan-30f.workers.dev/api'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development'

class AdminAPIClient {
  private baseURL: string
  private adminPassword: string

  constructor() {
    this.baseURL = API_BASE_URL
    this.adminPassword = ADMIN_PASSWORD
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return this.getMockData<T>(endpoint, options)
    }

    const url = `${this.baseURL}/admin/${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.adminPassword}`,
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error ${response.status}: ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Get mock data for development
   */
  private async getMockData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

    const [baseEndpoint] = endpoint.split('?')
    
    switch (baseEndpoint) {
      case 'overview':
        return mockData.dashboardMetrics as T

      case 'organizations':
        const orgParams = new URLSearchParams(endpoint.split('?')[1] || '')
        const page = parseInt(orgParams.get('page') || '1')
        const limit = parseInt(orgParams.get('limit') || '10')
        const search = orgParams.get('search') || ''
        const status = orgParams.get('status') || ''
        
        let filteredOrgs = mockData.organizations
        if (search) {
          filteredOrgs = filteredOrgs.filter(org => 
            org.team_name.toLowerCase().includes(search.toLowerCase()) ||
            org.domain?.toLowerCase().includes(search.toLowerCase())
          )
        }
        if (status) {
          filteredOrgs = filteredOrgs.filter(org => org.status === status)
        }
        
        const start = (page - 1) * limit
        const end = start + limit
        return {
          organizations: filteredOrgs.slice(start, end),
          total: filteredOrgs.length,
          page
        } as T

      case 'users':
        const userOrgId = new URLSearchParams(endpoint.split('?')[1] || '').get('organization_id')
        let filteredUsers = mockData.users
        if (userOrgId) {
          filteredUsers = filteredUsers.filter(user => user.organization_id === userOrgId)
        }
        return filteredUsers as T

      case 'agents':
        const agentOrgId = new URLSearchParams(endpoint.split('?')[1] || '').get('organization_id')
        let filteredAgents = mockData.agents
        if (agentOrgId) {
          filteredAgents = filteredAgents.filter(agent => agent.organization_id === agentOrgId)
        }
        return filteredAgents as T

      case 'tasks':
        const taskOrgId = new URLSearchParams(endpoint.split('?')[1] || '').get('organization_id')
        let filteredTasks = mockData.tasks
        if (taskOrgId) {
          filteredTasks = filteredTasks.filter(task => task.organization_id === taskOrgId)
        }
        return filteredTasks as T

      case 'pipelines':
        const pipelineOrgId = new URLSearchParams(endpoint.split('?')[1] || '').get('organization_id')
        let filteredPipelines = mockData.pipelines
        if (pipelineOrgId) {
          filteredPipelines = filteredPipelines.filter(pipeline => pipeline.organization_id === pipelineOrgId)
        }
        return filteredPipelines as T

      case 'plans':
        return mockData.subscriptionPlans as T

      case 'health':
        return mockData.systemHealth as T

      case 'analytics':
        return mockData.analytics as T

      case 'analytics/revenue':
        return {
          total_revenue: 153000,
          monthly_recurring: 12750,
          annual_recurring: 153000,
          growth_rate: 22.8,
          churn_rate: 3.2,
          plan_distribution: [
            { plan: 'Starter', count: 1, revenue: 290 },
            { plan: 'Professional', count: 2, revenue: 1980 },
            { plan: 'Enterprise', count: 1, revenue: 2990 }
          ]
        } as T

      case 'analytics/usage':
        return {
          total_requests: 13060,
          total_executions: 4870,
          average_response_time: 1250,
          success_rate: 94.7,
          top_organizations: [
            { name: 'Digital Solutions Inc', usage: 8750 },
            { name: 'TechCorp Innovations', usage: 3420 },
            { name: 'StartupFlow', usage: 890 }
          ],
          usage_trends: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            requests: Math.floor(Math.random() * 500) + 200,
            executions: Math.floor(Math.random() * 200) + 100
          }))
        } as T

      case 'audit-logs':
        const auditParams = new URLSearchParams(endpoint.split('?')[1] || '')
        const auditPage = parseInt(auditParams.get('page') || '1')
        const auditLimit = parseInt(auditParams.get('limit') || '10')
        
        const start2 = (auditPage - 1) * auditLimit
        const end2 = start2 + auditLimit
        return {
          logs: mockData.auditLogs.slice(start2, end2),
          total: mockData.auditLogs.length,
          page: auditPage
        } as T

      default:
        // Handle specific organization requests
        if (baseEndpoint.startsWith('organizations/')) {
          const orgId = baseEndpoint.split('/')[1]
          if (baseEndpoint.endsWith('/details')) {
            const org = mockData.organizations.find(o => o.id === orgId)
            if (org) {
              return {
                organization: org,
                users: mockData.users.filter(u => u.organization_id === orgId),
                agents: mockData.agents.filter(a => a.organization_id === orgId),
                tasks: mockData.tasks.filter(t => t.organization_id === orgId),
                pipelines: mockData.pipelines.filter(p => p.organization_id === orgId),
                usage_stats: {
                  monthly_requests: org.monthly_ai_requests,
                  monthly_executions: org.monthly_agent_executions + org.monthly_task_executions,
                  success_rate: 94.7,
                  average_response_time: 1250
                },
                recent_activity: [
                  { type: 'agent', action: 'Created new agent', timestamp: '2024-08-01T16:30:00Z', user: 'Sarah Johnson' },
                  { type: 'task', action: 'Scheduled task execution', timestamp: '2024-08-01T15:45:00Z', user: 'Mike Chen' },
                  { type: 'pipeline', action: 'Updated pipeline configuration', timestamp: '2024-08-01T14:20:00Z', user: 'Alex Rodriguez' }
                ]
              } as T
            }
          } else {
            const org = mockData.organizations.find(o => o.id === orgId)
            if (org) {
              return org as T
            }
          }
        }

        console.warn(`Mock data not implemented for endpoint: ${endpoint}`)
        return {} as T
    }
  }

  /**
   * Dashboard Overview Data
   */
  async getDashboardOverview(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('overview')
  }

  /**
   * Organizations Management
   */
  async getOrganizations(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ organizations: Organization[]; total: number; page: number }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `organizations?${queryString}` : 'organizations'
    
    return this.request(endpoint)
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.request<Organization>(`organizations/${id}`)
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    return this.request<Organization>(`organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async suspendOrganization(id: string, reason: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`organizations/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }

  async activateOrganization(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`organizations/${id}/activate`, {
      method: 'POST'
    })
  }

  /**
   * Plan Management
   */
  async changeOrganizationPlan(
    organizationId: string, 
    planId: string, 
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request('organizations/change-plan', {
      method: 'POST',
      body: JSON.stringify({ organizationId, planId, reason })
    })
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.request<SubscriptionPlan[]>('plans')
  }

  /**
   * Users Management
   */
  async getUsers(organizationId?: string): Promise<User[]> {
    const endpoint = organizationId ? `users?organization_id=${organizationId}` : 'users'
    return this.request<User[]>(endpoint)
  }

  /**
   * Resources (Agents, Tasks, Pipelines)
   */
  async getAgents(organizationId?: string): Promise<Agent[]> {
    const endpoint = organizationId ? `agents?organization_id=${organizationId}` : 'agents'
    return this.request<Agent[]>(endpoint)
  }

  async getTasks(organizationId?: string): Promise<Task[]> {
    const endpoint = organizationId ? `tasks?organization_id=${organizationId}` : 'tasks'
    return this.request<Task[]>(endpoint)
  }

  async getPipelines(organizationId?: string): Promise<Pipeline[]> {
    const endpoint = organizationId ? `pipelines?organization_id=${organizationId}` : 'pipelines'
    return this.request<Pipeline[]>(endpoint)
  }

  /**
   * Slack Integration
   */
  async getSlackChannels(organizationId: string): Promise<{
    channels: Array<{
      id: string
      name: string
      is_private: boolean
      is_member: boolean
      purpose: string
      topic: string
      num_members: number
    }>
    organization: {
      id: string
      team_name: string
      slack_team_id: string
    }
    total: number
    error?: string
  }> {
    return this.request(`slack-channels?organization_id=${organizationId}`)
  }

  async getAgentThreads(agentId: string): Promise<{
    agent: {
      id: string
      name: string
      openai_assistant_id: string
      organization_id: string
    }
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
  }> {
    return this.request(`agent-threads?agent_id=${agentId}`)
  }

  /**
   * System Health Monitoring
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>('health')
  }

  /**
   * Analytics & Reporting
   */
  async getAnalytics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<Analytics> {
    return this.request<Analytics>(`analytics?range=${timeRange}`)
  }

  async getRevenueAnalytics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<{
    total_revenue: number
    monthly_recurring: number
    annual_recurring: number
    growth_rate: number
    churn_rate: number
    plan_distribution: Array<{ plan: string; count: number; revenue: number }>
  }> {
    return this.request(`analytics/revenue?range=${timeRange}`)
  }

  async getUsageAnalytics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<{
    total_requests: number
    total_executions: number
    average_response_time: number
    success_rate: number
    top_organizations: Array<{ name: string; usage: number }>
    usage_trends: Array<{ date: string; requests: number; executions: number }>
  }> {
    return this.request(`analytics/usage?range=${timeRange}`)
  }

  /**
   * Audit Logging
   */
  async getAuditLogs(params?: {
    page?: number
    limit?: number
    action?: string
    user?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ logs: AuditLog[]; total: number; page: number }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.action) searchParams.set('action', params.action)
    if (params?.user) searchParams.set('user', params.user)
    if (params?.dateFrom) searchParams.set('date_from', params.dateFrom)
    if (params?.dateTo) searchParams.set('date_to', params.dateTo)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `audit-logs?${queryString}` : 'audit-logs'
    
    return this.request(endpoint)
  }

  /**
   * Organization Details with Related Data
   */
  async getOrganizationDetails(id: string): Promise<{
    organization: Organization
    users: User[]
    agents: Agent[]
    tasks: Task[]
    pipelines: Pipeline[]
    usage_stats: {
      monthly_requests: number
      monthly_executions: number
      success_rate: number
      average_response_time: number
    }
    recent_activity: Array<{
      type: string
      action: string
      timestamp: string
      user: string
    }>
  }> {
    return this.request(`organizations/${id}/details`)
  }

  /**
   * Search across all resources
   */
  async search(query: string, filters?: {
    type?: 'organizations' | 'users' | 'agents' | 'tasks' | 'pipelines'
    status?: string
    organization_id?: string
  }): Promise<{
    organizations: Organization[]
    users: User[]
    agents: Agent[]
    tasks: Task[]
    pipelines: Pipeline[]
    total: number
  }> {
    const searchParams = new URLSearchParams({ q: query })
    if (filters?.type) searchParams.set('type', filters.type)
    if (filters?.status) searchParams.set('status', filters.status)
    if (filters?.organization_id) searchParams.set('organization_id', filters.organization_id)
    
    return this.request(`search?${searchParams.toString()}`)
  }
}

// Create singleton instance
const adminAPI = new AdminAPIClient()

export default adminAPI

// Export individual methods for convenience
export const {
  getDashboardOverview,
  getOrganizations,
  getOrganization,
  updateOrganization,
  suspendOrganization,
  activateOrganization,
  changeOrganizationPlan,
  getSubscriptionPlans,
  getUsers,
  getAgents,
  getTasks,
  getPipelines,
  getSlackChannels,
  getSystemHealth,
  getAnalytics,
  getRevenueAnalytics,
  getUsageAnalytics,
  getAuditLogs,
  getOrganizationDetails,
  search
} = adminAPI 
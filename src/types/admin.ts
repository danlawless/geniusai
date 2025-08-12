// Core data types based on the GeniusAI database schema

export interface Organization {
  id: string
  slack_team_id: string
  team_name: string
  domain?: string
  status: 'active' | 'suspended' | 'cancelled'
  created_at: string
  updated_at: string
  settings: Record<string, any>
  
  // Billing
  stripe_customer_id?: string
  billing_email?: string
  
  // Slack integration
  bot_token?: string
  bot_user_id?: string
  installed_at: string
  
  // Usage tracking
  monthly_ai_requests: number
  monthly_agent_executions: number
  monthly_task_executions: number
  last_usage_reset: string
  
  // Computed fields
  user_count?: number
  agent_count?: number
  task_count?: number
  pipeline_count?: number
  health_status?: 'healthy' | 'warning' | 'critical'
  subscription?: OrganizationSubscription
}

export interface User {
  id: string
  organization_id: string
  slack_user_id: string
  email?: string
  full_name?: string
  avatar_url?: string
  role: 'owner' | 'admin' | 'user' | 'viewer'
  created_at: string
  updated_at: string
  last_active_at: string
  preferences: Record<string, any>
  timezone: string
  monthly_ai_requests: number
  monthly_agent_interactions: number
}

export interface Agent {
  id: string
  organization_id: string
  name: string
  description?: string
  prompt: string
  slack_channels: string[]
  respond_to_all_messages: boolean
  openai_assistant_id?: string
  openai_thread_id?: string
  capabilities: Record<string, any>
  function_calling_enabled: boolean
  settings: Record<string, any>
  persistent_context?: string
  status: 'active' | 'paused' | 'disabled'
  visibility: 'public' | 'private'
  created_at: string
  updated_at: string
  created_by?: string
  last_interaction_at?: string
  total_interactions: number
  monthly_interactions: number
  success_rate: number
  energy: number
  summary?: string
}

export interface Task {
  id: string
  organization_id: string
  name: string
  description?: string
  prompt: string
  agent_id?: string
  agent_name?: string
  schedule_type: 'once' | 'daily' | 'weekly' | 'monthly' | 'cron'
  schedule_config: Record<string, any>
  cron_expression?: string
  next_run_at?: string
  last_run_at?: string
  output_channels: string[]
  pipeline_id?: string
  enabled: boolean
  status: 'active' | 'paused' | 'disabled'
  visibility: 'public' | 'private'
  created_at: string
  updated_at: string
  created_by?: string
  total_executions: number
  successful_executions: number
  failed_executions: number
  average_duration_ms: number
}

export interface Pipeline {
  id: string
  organization_id: string
  name: string
  description?: string
  steps: any[]
  agent_sequence: string[]
  output_channels: string[]
  enabled: boolean
  status: 'active' | 'paused' | 'disabled'
  visibility: 'public' | 'private'
  created_at: string
  updated_at: string
  created_by?: string
  total_executions: number
  successful_executions: number
  failed_executions: number
  average_duration_ms: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  display_name: string
  description?: string
  price_monthly: number
  price_yearly: number
  limits: {
    agents: number
    tasks: number
    pipelines: number
    users: number
    monthly_ai_requests: number
  }
  features: string[]
  tier: number
  is_active: boolean
  created_at: string
}

export interface OrganizationSubscription {
  id: string
  organization_id: string
  plan_id: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  status: 'active' | 'past_due' | 'cancelled' | 'incomplete'
  billing_cycle: 'monthly' | 'yearly'
  created_at: string
  updated_at: string
  current_period_start: string
  current_period_end: string
  cancelled_at?: string
  trial_end?: string
  current_agents: number
  current_tasks: number
  current_pipelines: number
  current_users: number
  plan?: SubscriptionPlan
}

export interface DashboardMetrics {
  organizations: {
    total: number
    active: number
    suspended: number
    cancelled: number
    growth_rate: number
  }
  users: {
    total: number
    active: number
    new_this_month: number
    growth_rate: number
  }
  resources: {
    total_agents: number
    active_agents: number
    total_tasks: number
    active_tasks: number
    total_pipelines: number
    active_pipelines: number
  }
  revenue: {
    monthly_recurring: number
    annual_recurring: number
    growth_rate: number
    churn_rate: number
  }
  usage: {
    total_ai_requests: number
    total_executions: number
    average_response_time: number
    success_rate: number
  }
  health: {
    system_status: 'healthy' | 'warning' | 'critical'
    database_health: number
    api_health: number
    uptime: number
  }
}

export interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical'
  database: {
    status: 'healthy' | 'warning' | 'critical'
    response_time_ms: number
    active_connections: number
    last_check: string
  }
  api: {
    status: 'healthy' | 'warning' | 'critical'
    response_time_ms: number
    success_rate: number
    error_rate: number
    last_check: string
  }
  worker: {
    status: 'healthy' | 'warning' | 'critical'
    memory_usage: number
    cpu_usage: number
    uptime: number
    last_check: string
  }
}

export interface Analytics {
  timeRange: '7d' | '30d' | '90d'
  signups: {
    total: number
    data: Array<{ date: string; count: number }>
    growth_rate: number
  }
  revenue: {
    total: number
    data: Array<{ date: string; amount: number }>
    growth_rate: number
  }
  engagement: {
    daily_active_users: number
    monthly_active_users: number
    average_session_time: number
    feature_adoption: Array<{ feature: string; adoption_rate: number }>
  }
  performance: {
    average_response_time: number
    success_rate: number
    error_rate: number
    uptime: number
  }
}

export interface AdminUser {
  id: string
  username: string
  role: 'super_admin' | 'admin' | 'viewer'
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface AuditLog {
  id: string
  admin_user_id: string
  action: string
  resource_type?: string
  resource_id?: string
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Component prop types
export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: any
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  loading?: boolean
}

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'warning' | 'danger'
  text: string
}

export interface TableColumn {
  key: string
  header: string
  render?: (value: any, row: any) => any
  sortable?: boolean
}

export interface TableProps {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
  searchable?: boolean
  onSearch?: (query: string) => void
} 
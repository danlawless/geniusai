/**
 * Mock Data Service for GeniusAI Admin Dashboard
 * Provides comprehensive dummy data for demonstration purposes
 */

import { 
  Organization, 
  User, 
  Agent, 
  Task, 
  Pipeline, 
  DashboardMetrics, 
  SystemHealth, 
  Analytics,
  SubscriptionPlan,
  OrganizationSubscription,
  AuditLog
} from '@/types/admin'

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const randomPastDate = (daysAgo: number) => {
  const now = new Date()
  const past = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
  return randomDate(past, now)
}

// Mock Subscription Plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'starter',
    display_name: 'Starter',
    description: 'Perfect for small teams getting started with AI automation',
    price_monthly: 29,
    price_yearly: 290,
    limits: {
      agents: 3,
      tasks: 10,
      pipelines: 2,
      users: 5,
      monthly_ai_requests: 1000
    },
    features: ['Basic AI Agents', 'Task Scheduling', 'Slack Integration', 'Email Support'],
    tier: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan_professional',
    name: 'professional',
    display_name: 'Professional',
    description: 'Advanced features for growing teams and complex workflows',
    price_monthly: 99,
    price_yearly: 990,
    limits: {
      agents: 15,
      tasks: 50,
      pipelines: 10,
      users: 25,
      monthly_ai_requests: 5000
    },
    features: ['Advanced AI Agents', 'Pipeline Automation', 'Analytics Dashboard', 'Priority Support', 'Custom Integrations'],
    tier: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'plan_enterprise',
    name: 'enterprise',
    display_name: 'Enterprise',
    description: 'Unlimited power for large organizations',
    price_monthly: 299,
    price_yearly: 2990,
    limits: {
      agents: 100,
      tasks: 500,
      pipelines: 50,
      users: 100,
      monthly_ai_requests: 25000
    },
    features: ['Unlimited AI Agents', 'Advanced Analytics', 'Custom Models', 'Dedicated Support', 'SLA Guarantee', 'White-label Options'],
    tier: 3,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: 'org_1',
    slack_team_id: 'T12345678',
    team_name: 'TechCorp Innovations',
    domain: 'techcorp.com',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-08-01T14:20:00Z',
    settings: { timezone: 'America/New_York', notifications: true },
    stripe_customer_id: 'cus_techcorp123',
    billing_email: 'billing@techcorp.com',
    bot_token: 'xoxb-techcorp-token',
    bot_user_id: 'U12345678',
    installed_at: '2024-01-15T10:30:00Z',
    monthly_ai_requests: 3420,
    monthly_agent_executions: 1250,
    monthly_task_executions: 890,
    last_usage_reset: '2024-08-01T00:00:00Z',
    user_count: 24,
    agent_count: 12,
    task_count: 35,
    pipeline_count: 8,
    health_status: 'healthy',
    subscription: {
      id: 'sub_1',
      organization_id: 'org_1',
      plan_id: 'plan_professional',
      stripe_subscription_id: 'sub_techcorp123',
      stripe_customer_id: 'cus_techcorp123',
      status: 'active',
      billing_cycle: 'monthly',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-08-01T14:20:00Z',
      current_period_start: '2024-08-01T00:00:00Z',
      current_period_end: '2024-09-01T00:00:00Z',
      current_agents: 12,
      current_tasks: 35,
      current_pipelines: 8,
      current_users: 24,
      plan: mockSubscriptionPlans[1]
    }
  },
  {
    id: 'org_2',
    slack_team_id: 'T87654321',
    team_name: 'Digital Solutions Inc',
    domain: 'digitalsolutions.io',
    status: 'active',
    created_at: '2024-02-20T09:15:00Z',
    updated_at: '2024-08-01T16:45:00Z',
    settings: { timezone: 'America/Los_Angeles', notifications: true },
    stripe_customer_id: 'cus_digital456',
    billing_email: 'accounts@digitalsolutions.io',
    bot_token: 'xoxb-digital-token',
    bot_user_id: 'U87654321',
    installed_at: '2024-02-20T09:15:00Z',
    monthly_ai_requests: 8750,
    monthly_agent_executions: 3200,
    monthly_task_executions: 2100,
    last_usage_reset: '2024-08-01T00:00:00Z',
    user_count: 67,
    agent_count: 28,
    task_count: 85,
    pipeline_count: 15,
    health_status: 'healthy',
    subscription: {
      id: 'sub_2',
      organization_id: 'org_2',
      plan_id: 'plan_enterprise',
      stripe_subscription_id: 'sub_digital456',
      stripe_customer_id: 'cus_digital456',
      status: 'active',
      billing_cycle: 'yearly',
      created_at: '2024-02-20T09:15:00Z',
      updated_at: '2024-08-01T16:45:00Z',
      current_period_start: '2024-02-20T00:00:00Z',
      current_period_end: '2025-02-20T00:00:00Z',
      current_agents: 28,
      current_tasks: 85,
      current_pipelines: 15,
      current_users: 67,
      plan: mockSubscriptionPlans[2]
    }
  },
  {
    id: 'org_3',
    slack_team_id: 'T11223344',
    team_name: 'StartupFlow',
    domain: 'startupflow.com',
    status: 'active',
    created_at: '2024-06-10T14:22:00Z',
    updated_at: '2024-08-01T11:30:00Z',
    settings: { timezone: 'Europe/London', notifications: true },
    stripe_customer_id: 'cus_startup789',
    billing_email: 'finance@startupflow.com',
    bot_token: 'xoxb-startup-token',
    bot_user_id: 'U11223344',
    installed_at: '2024-06-10T14:22:00Z',
    monthly_ai_requests: 890,
    monthly_agent_executions: 420,
    monthly_task_executions: 280,
    last_usage_reset: '2024-08-01T00:00:00Z',
    user_count: 8,
    agent_count: 3,
    task_count: 12,
    pipeline_count: 2,
    health_status: 'healthy',
    subscription: {
      id: 'sub_3',
      organization_id: 'org_3',
      plan_id: 'plan_starter',
      stripe_subscription_id: 'sub_startup789',
      stripe_customer_id: 'cus_startup789',
      status: 'active',
      billing_cycle: 'monthly',
      created_at: '2024-06-10T14:22:00Z',
      updated_at: '2024-08-01T11:30:00Z',
      current_period_start: '2024-08-01T00:00:00Z',
      current_period_end: '2024-09-01T00:00:00Z',
      current_agents: 3,
      current_tasks: 12,
      current_pipelines: 2,
      current_users: 8,
      plan: mockSubscriptionPlans[0]
    }
  },
  {
    id: 'org_4',
    slack_team_id: 'T55667788',
    team_name: 'Global Dynamics',
    domain: 'globaldynamics.com',
    status: 'suspended',
    created_at: '2024-03-05T08:45:00Z',
    updated_at: '2024-07-28T13:15:00Z',
    settings: { timezone: 'America/Chicago', notifications: false },
    stripe_customer_id: 'cus_global101',
    billing_email: 'billing@globaldynamics.com',
    bot_token: 'xoxb-global-token',
    bot_user_id: 'U55667788',
    installed_at: '2024-03-05T08:45:00Z',
    monthly_ai_requests: 0,
    monthly_agent_executions: 0,
    monthly_task_executions: 0,
    last_usage_reset: '2024-08-01T00:00:00Z',
    user_count: 45,
    agent_count: 18,
    task_count: 62,
    pipeline_count: 12,
    health_status: 'critical',
    subscription: {
      id: 'sub_4',
      organization_id: 'org_4',
      plan_id: 'plan_professional',
      stripe_subscription_id: 'sub_global101',
      stripe_customer_id: 'cus_global101',
      status: 'past_due',
      billing_cycle: 'monthly',
      created_at: '2024-03-05T08:45:00Z',
      updated_at: '2024-07-28T13:15:00Z',
      current_period_start: '2024-07-01T00:00:00Z',
      current_period_end: '2024-08-01T00:00:00Z',
      current_agents: 18,
      current_tasks: 62,
      current_pipelines: 12,
      current_users: 45,
      plan: mockSubscriptionPlans[1]
    }
  }
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_1',
    organization_id: 'org_1',
    slack_user_id: 'U1234567890',
    email: 'sarah.johnson@techcorp.com',
    full_name: 'Sarah Johnson',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'owner',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-08-01T14:20:00Z',
    last_active_at: '2024-08-01T16:45:00Z',
    preferences: { theme: 'dark', notifications: true },
    timezone: 'America/New_York',
    monthly_ai_requests: 450,
    monthly_agent_interactions: 125
  },
  {
    id: 'user_2',
    organization_id: 'org_1',
    slack_user_id: 'U2345678901',
    email: 'mike.chen@techcorp.com',
    full_name: 'Mike Chen',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    role: 'admin',
    created_at: '2024-01-20T11:15:00Z',
    updated_at: '2024-08-01T15:30:00Z',
    last_active_at: '2024-08-01T15:30:00Z',
    preferences: { theme: 'light', notifications: true },
    timezone: 'America/New_York',
    monthly_ai_requests: 380,
    monthly_agent_interactions: 95
  },
  {
    id: 'user_3',
    organization_id: 'org_2',
    slack_user_id: 'U3456789012',
    email: 'alex.rodriguez@digitalsolutions.io',
    full_name: 'Alex Rodriguez',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'owner',
    created_at: '2024-02-20T09:15:00Z',
    updated_at: '2024-08-01T16:45:00Z',
    last_active_at: '2024-08-01T17:20:00Z',
    preferences: { theme: 'dark', notifications: true },
    timezone: 'America/Los_Angeles',
    monthly_ai_requests: 720,
    monthly_agent_interactions: 280
  },
  {
    id: 'user_4',
    organization_id: 'org_2',
    slack_user_id: 'U4567890123',
    email: 'emma.williams@digitalsolutions.io',
    full_name: 'Emma Williams',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    role: 'admin',
    created_at: '2024-03-01T10:30:00Z',
    updated_at: '2024-08-01T14:15:00Z',
    last_active_at: '2024-08-01T14:15:00Z',
    preferences: { theme: 'light', notifications: false },
    timezone: 'America/Los_Angeles',
    monthly_ai_requests: 520,
    monthly_agent_interactions: 165
  },
  {
    id: 'user_5',
    organization_id: 'org_3',
    slack_user_id: 'U5678901234',
    email: 'james.taylor@startupflow.com',
    full_name: 'James Taylor',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    role: 'owner',
    created_at: '2024-06-10T14:22:00Z',
    updated_at: '2024-08-01T11:30:00Z',
    last_active_at: '2024-08-01T12:45:00Z',
    preferences: { theme: 'dark', notifications: true },
    timezone: 'Europe/London',
    monthly_ai_requests: 180,
    monthly_agent_interactions: 45
  }
]

// Mock Agents
export const mockAgents: Agent[] = [
  {
    id: 'agent_1',
    organization_id: 'org_1',
    name: 'CustomerSupport Pro',
    description: 'Advanced customer support agent with sentiment analysis and escalation capabilities',
    prompt: 'You are a professional customer support agent. Analyze customer inquiries, provide helpful solutions, and escalate complex issues when needed.',
    slack_channels: ['#customer-support', '#general'],
    respond_to_all_messages: false,
    openai_assistant_id: 'asst_customerSupport123',
    openai_thread_id: 'thread_cs456',
    capabilities: { sentiment_analysis: true, escalation: true, knowledge_base: true },
    function_calling_enabled: true,
    settings: { max_response_length: 2000, temperature: 0.7 },
    persistent_context: 'Customer support context with company policies and procedures',
    status: 'active',
    visibility: 'public',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-08-01T10:30:00Z',
    created_by: 'user_1',
    last_interaction_at: '2024-08-01T16:20:00Z',
    total_interactions: 1247,
    monthly_interactions: 342,
    success_rate: 94.5,
    energy: 85,
    summary: 'High-performing customer support agent with excellent satisfaction ratings'
  },
  {
    id: 'agent_2',
    organization_id: 'org_1',
    name: 'Code Review Assistant',
    description: 'AI-powered code review agent that analyzes pull requests and suggests improvements',
    prompt: 'You are a senior software engineer specializing in code reviews. Analyze code quality, suggest improvements, and identify potential issues.',
    slack_channels: ['#engineering', '#code-review'],
    respond_to_all_messages: true,
    openai_assistant_id: 'asst_codeReview789',
    openai_thread_id: 'thread_cr101',
    capabilities: { code_analysis: true, security_check: true, performance_optimization: true },
    function_calling_enabled: true,
    settings: { max_response_length: 3000, temperature: 0.3 },
    persistent_context: 'Code review guidelines and best practices for the engineering team',
    status: 'active',
    visibility: 'private',
    created_at: '2024-02-01T14:15:00Z',
    updated_at: '2024-08-01T11:45:00Z',
    created_by: 'user_2',
    last_interaction_at: '2024-08-01T15:10:00Z',
    total_interactions: 856,
    monthly_interactions: 198,
    success_rate: 97.2,
    energy: 92,
    summary: 'Highly accurate code review agent that has prevented numerous bugs'
  },
  {
    id: 'agent_3',
    organization_id: 'org_2',
    name: 'Sales Intelligence Bot',
    description: 'Advanced sales assistant that tracks leads, analyzes opportunities, and provides insights',
    prompt: 'You are a sales intelligence expert. Analyze customer interactions, identify opportunities, and provide strategic sales insights.',
    slack_channels: ['#sales', '#leads', '#opportunities'],
    respond_to_all_messages: false,
    openai_assistant_id: 'asst_salesIntel456',
    openai_thread_id: 'thread_si789',
    capabilities: { lead_scoring: true, opportunity_analysis: true, forecasting: true },
    function_calling_enabled: true,
    settings: { max_response_length: 2500, temperature: 0.6 },
    persistent_context: 'Sales methodology and customer data for Digital Solutions Inc',
    status: 'active',
    visibility: 'public',
    created_at: '2024-02-22T10:30:00Z',
    updated_at: '2024-08-01T13:20:00Z',
    created_by: 'user_3',
    last_interaction_at: '2024-08-01T17:00:00Z',
    total_interactions: 2134,
    monthly_interactions: 567,
    success_rate: 91.8,
    energy: 88,
    summary: 'Powerful sales agent that has contributed to 23% increase in conversion rates'
  },
  {
    id: 'agent_4',
    organization_id: 'org_2',
    name: 'Content Creator AI',
    description: 'Creative content generation agent for marketing campaigns and social media',
    prompt: 'You are a creative content strategist. Generate engaging content for various marketing channels while maintaining brand voice and guidelines.',
    slack_channels: ['#marketing', '#content', '#social-media'],
    respond_to_all_messages: true,
    openai_assistant_id: 'asst_contentAI123',
    openai_thread_id: 'thread_cc456',
    capabilities: { content_generation: true, brand_voice: true, seo_optimization: true },
    function_calling_enabled: false,
    settings: { max_response_length: 4000, temperature: 0.8 },
    persistent_context: 'Brand guidelines and content strategy for Digital Solutions Inc',
    status: 'active',
    visibility: 'public',
    created_at: '2024-03-10T11:45:00Z',
    updated_at: '2024-08-01T14:30:00Z',
    created_by: 'user_4',
    last_interaction_at: '2024-08-01T16:45:00Z',
    total_interactions: 1567,
    monthly_interactions: 423,
    success_rate: 89.3,
    energy: 76,
    summary: 'Creative agent that has generated over 500 pieces of marketing content'
  },
  {
    id: 'agent_5',
    organization_id: 'org_3',
    name: 'Project Manager Bot',
    description: 'Intelligent project management assistant that tracks progress and identifies blockers',
    prompt: 'You are an experienced project manager. Monitor project progress, identify risks, and suggest solutions to keep projects on track.',
    slack_channels: ['#projects', '#general'],
    respond_to_all_messages: false,
    openai_assistant_id: 'asst_projectMgr789',
    openai_thread_id: 'thread_pm101',
    capabilities: { progress_tracking: true, risk_analysis: true, resource_planning: true },
    function_calling_enabled: true,
    settings: { max_response_length: 2000, temperature: 0.5 },
    persistent_context: 'Project management methodology and current project status for StartupFlow',
    status: 'active',
    visibility: 'public',
    created_at: '2024-06-12T15:30:00Z',
    updated_at: '2024-08-01T09:15:00Z',
    created_by: 'user_5',
    last_interaction_at: '2024-08-01T11:30:00Z',
    total_interactions: 234,
    monthly_interactions: 67,
    success_rate: 96.1,
    energy: 91,
    summary: 'Efficient project management agent that has improved delivery times by 18%'
  }
]

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task_1',
    organization_id: 'org_1',
    name: 'Daily Sales Report',
    description: 'Generate and send daily sales performance report to management team',
    prompt: 'Analyze yesterday\'s sales data and create a comprehensive report including metrics, trends, and recommendations.',
    agent_id: 'agent_1',
    agent_name: 'CustomerSupport Pro',
    schedule_type: 'daily',
    schedule_config: { hour: 9, minute: 0 },
    next_run_at: '2024-08-02T09:00:00Z',
    last_run_at: '2024-08-01T09:00:00Z',
    output_channels: ['#management', '#sales'],
    pipeline_id: 'pipeline_1',
    enabled: true,
    status: 'active',
    visibility: 'private',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-08-01T08:30:00Z',
    created_by: 'user_1',
    total_executions: 195,
    successful_executions: 189,
    failed_executions: 6,
    average_duration_ms: 4500
  },
  {
    id: 'task_2',
    organization_id: 'org_1',
    name: 'Weekly Code Quality Check',
    description: 'Automated code quality analysis and report generation for engineering team',
    prompt: 'Analyze the week\'s code commits, identify quality issues, and suggest improvements.',
    agent_id: 'agent_2',
    agent_name: 'Code Review Assistant',
    schedule_type: 'weekly',
    schedule_config: { day: 'friday', hour: 17, minute: 0 },
    next_run_at: '2024-08-02T17:00:00Z',
    last_run_at: '2024-07-26T17:00:00Z',
    output_channels: ['#engineering'],
    enabled: true,
    status: 'active',
    visibility: 'private',
    created_at: '2024-02-05T12:30:00Z',
    updated_at: '2024-07-30T16:45:00Z',
    created_by: 'user_2',
    total_executions: 26,
    successful_executions: 25,
    failed_executions: 1,
    average_duration_ms: 12000
  },
  {
    id: 'task_3',
    organization_id: 'org_2',
    name: 'Lead Qualification Automation',
    description: 'Automatically qualify and score new leads from various sources',
    prompt: 'Analyze new lead information, score based on qualification criteria, and route to appropriate sales representative.',
    agent_id: 'agent_3',
    agent_name: 'Sales Intelligence Bot',
    schedule_type: 'cron',
    schedule_config: {},
    cron_expression: '0 */2 * * *',
    next_run_at: '2024-08-01T18:00:00Z',
    last_run_at: '2024-08-01T16:00:00Z',
    output_channels: ['#sales', '#leads'],
    pipeline_id: 'pipeline_2',
    enabled: true,
    status: 'active',
    visibility: 'public',
    created_at: '2024-02-25T14:20:00Z',
    updated_at: '2024-08-01T15:10:00Z',
    created_by: 'user_3',
    total_executions: 1340,
    successful_executions: 1298,
    failed_executions: 42,
    average_duration_ms: 3200
  },
  {
    id: 'task_4',
    organization_id: 'org_2',
    name: 'Social Media Content Calendar',
    description: 'Generate weekly social media content calendar with engaging posts',
    prompt: 'Create a weekly social media content calendar with engaging posts, hashtags, and optimal posting times.',
    agent_id: 'agent_4',
    agent_name: 'Content Creator AI',
    schedule_type: 'weekly',
    schedule_config: { day: 'sunday', hour: 10, minute: 0 },
    next_run_at: '2024-08-04T10:00:00Z',
    last_run_at: '2024-07-28T10:00:00Z',
    output_channels: ['#marketing', '#social-media'],
    enabled: true,
    status: 'active',
    visibility: 'public',
    created_at: '2024-03-15T09:45:00Z',
    updated_at: '2024-07-30T11:20:00Z',
    created_by: 'user_4',
    total_executions: 20,
    successful_executions: 19,
    failed_executions: 1,
    average_duration_ms: 8500
  },
  {
    id: 'task_5',
    organization_id: 'org_3',
    name: 'Sprint Planning Assistant',
    description: 'Automated sprint planning and capacity analysis for development team',
    prompt: 'Analyze team capacity, review backlog items, and suggest optimal sprint composition.',
    agent_id: 'agent_5',
    agent_name: 'Project Manager Bot',
    schedule_type: 'weekly',
    schedule_config: { day: 'monday', hour: 9, minute: 30 },
    next_run_at: '2024-08-05T09:30:00Z',
    last_run_at: '2024-07-29T09:30:00Z',
    output_channels: ['#projects'],
    enabled: true,
    status: 'active',
    visibility: 'private',
    created_at: '2024-06-15T11:00:00Z',
    updated_at: '2024-07-31T10:15:00Z',
    created_by: 'user_5',
    total_executions: 8,
    successful_executions: 8,
    failed_executions: 0,
    average_duration_ms: 6800
  }
]

// Mock Pipelines
export const mockPipelines: Pipeline[] = [
  {
    id: 'pipeline_1',
    organization_id: 'org_1',
    name: 'Customer Onboarding Flow',
    description: 'Automated customer onboarding process with multiple touchpoints and follow-ups',
    steps: [
      { id: 'step_1', name: 'Welcome Message', agent_id: 'agent_1', delay_minutes: 0 },
      { id: 'step_2', name: 'Setup Guidance', agent_id: 'agent_1', delay_minutes: 60 },
      { id: 'step_3', name: 'Follow-up Check', agent_id: 'agent_1', delay_minutes: 1440 }
    ],
    agent_sequence: ['agent_1'],
    output_channels: ['#customer-success', '#onboarding'],
    enabled: true,
    status: 'active',
    visibility: 'private',
    created_at: '2024-01-25T13:15:00Z',
    updated_at: '2024-07-28T14:30:00Z',
    created_by: 'user_1',
    total_executions: 156,
    successful_executions: 148,
    failed_executions: 8,
    average_duration_ms: 45000
  },
  {
    id: 'pipeline_2',
    organization_id: 'org_2',
    name: 'Lead Nurturing Campaign',
    description: 'Multi-stage lead nurturing pipeline with personalized content and scoring',
    steps: [
      { id: 'step_1', name: 'Lead Qualification', agent_id: 'agent_3', delay_minutes: 0 },
      { id: 'step_2', name: 'Content Personalization', agent_id: 'agent_4', delay_minutes: 30 },
      { id: 'step_3', name: 'Follow-up Sequence', agent_id: 'agent_3', delay_minutes: 2880 }
    ],
    agent_sequence: ['agent_3', 'agent_4'],
    output_channels: ['#sales', '#marketing'],
    enabled: true,
    status: 'active',
    visibility: 'public',
    created_at: '2024-03-01T10:45:00Z',
    updated_at: '2024-08-01T09:20:00Z',
    created_by: 'user_3',
    total_executions: 423,
    successful_executions: 398,
    failed_executions: 25,
    average_duration_ms: 78000
  },
  {
    id: 'pipeline_3',
    organization_id: 'org_3',
    name: 'Project Delivery Workflow',
    description: 'End-to-end project delivery pipeline with automated status updates and notifications',
    steps: [
      { id: 'step_1', name: 'Project Kickoff', agent_id: 'agent_5', delay_minutes: 0 },
      { id: 'step_2', name: 'Progress Tracking', agent_id: 'agent_5', delay_minutes: 1440 },
      { id: 'step_3', name: 'Completion Report', agent_id: 'agent_5', delay_minutes: 0 }
    ],
    agent_sequence: ['agent_5'],
    output_channels: ['#projects', '#management'],
    enabled: true,
    status: 'active',
    visibility: 'private',
    created_at: '2024-06-20T16:30:00Z',
    updated_at: '2024-07-31T12:45:00Z',
    created_by: 'user_5',
    total_executions: 12,
    successful_executions: 11,
    failed_executions: 1,
    average_duration_ms: 120000
  }
]

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  organizations: {
    total: 4,
    active: 3,
    suspended: 1,
    cancelled: 0,
    growth_rate: 25.5
  },
  users: {
    total: 144,
    active: 132,
    new_this_month: 18,
    growth_rate: 15.2
  },
  resources: {
    total_agents: 43,
    active_agents: 41,
    total_tasks: 132,
    active_tasks: 128,
    total_pipelines: 25,
    active_pipelines: 24
  },
  revenue: {
    monthly_recurring: 12750,
    annual_recurring: 153000,
    growth_rate: 22.8,
    churn_rate: 3.2
  },
  usage: {
    total_ai_requests: 13060,
    total_executions: 4870,
    average_response_time: 1250,
    success_rate: 94.7
  },
  health: {
    system_status: 'healthy',
    database_health: 98.5,
    api_health: 97.2,
    uptime: 99.9
  }
}

// Mock System Health
export const mockSystemHealth: SystemHealth = {
  overall_status: 'healthy',
  database: {
    status: 'healthy',
    response_time_ms: 45,
    active_connections: 12,
    last_check: '2024-08-01T17:00:00Z'
  },
  api: {
    status: 'healthy',
    response_time_ms: 120,
    success_rate: 97.2,
    error_rate: 2.8,
    last_check: '2024-08-01T17:00:00Z'
  },
  worker: {
    status: 'healthy',
    memory_usage: 68.5,
    cpu_usage: 23.8,
    uptime: 99.9,
    last_check: '2024-08-01T17:00:00Z'
  }
}

// Mock Analytics
export const mockAnalytics: Analytics = {
  timeRange: '30d',
  signups: {
    total: 18,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 3) + (i > 20 ? 1 : 0)
    })),
    growth_rate: 25.5
  },
  revenue: {
    total: 12750,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 500) + 300
    })),
    growth_rate: 22.8
  },
  engagement: {
    daily_active_users: 89,
    monthly_active_users: 132,
    average_session_time: 1450,
    feature_adoption: [
      { feature: 'AI Agents', adoption_rate: 94.2 },
      { feature: 'Task Automation', adoption_rate: 87.5 },
      { feature: 'Pipeline Workflows', adoption_rate: 73.8 },
      { feature: 'Analytics Dashboard', adoption_rate: 65.1 },
      { feature: 'Custom Integrations', adoption_rate: 42.3 }
    ]
  },
  performance: {
    average_response_time: 1250,
    success_rate: 94.7,
    error_rate: 5.3,
    uptime: 99.9
  }
}

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit_1',
    admin_user_id: 'admin_1',
    action: 'organization.suspend',
    resource_type: 'organization',
    resource_id: 'org_4',
    details: { reason: 'Payment failure - multiple attempts', previous_status: 'active' },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2024-07-28T13:15:00Z'
  },
  {
    id: 'audit_2',
    admin_user_id: 'admin_1',
    action: 'organization.plan_change',
    resource_type: 'organization',
    resource_id: 'org_2',
    details: { from_plan: 'professional', to_plan: 'enterprise', reason: 'Upgrade request' },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2024-07-25T10:30:00Z'
  },
  {
    id: 'audit_3',
    admin_user_id: 'admin_1',
    action: 'user.role_change',
    resource_type: 'user',
    resource_id: 'user_4',
    details: { from_role: 'user', to_role: 'admin', organization: 'Digital Solutions Inc' },
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2024-07-20T14:45:00Z'
  }
]

// Export all mock data
export const mockData = {
  organizations: mockOrganizations,
  users: mockUsers,
  agents: mockAgents,
  tasks: mockTasks,
  pipelines: mockPipelines,
  subscriptionPlans: mockSubscriptionPlans,
  dashboardMetrics: mockDashboardMetrics,
  systemHealth: mockSystemHealth,
  analytics: mockAnalytics,
  auditLogs: mockAuditLogs
}

export default mockData


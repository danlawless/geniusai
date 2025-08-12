'use client'

import { useState, useEffect } from 'react'
import { 
  Home, 
  Building2, 
  Users, 
  Bot, 
  Calendar, 
  Workflow, 
  BarChart3, 
  Heart, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Shield,
  Sparkles
} from 'lucide-react'
import DashboardOverview from './DashboardOverview'
import OrganizationsView from './OrganizationsView'
import UsersView from './UsersView'
import AgentsView from './AgentsView'
import TasksView from './TasksView'
import PipelinesView from './PipelinesView'
import HealthView from './HealthView'
import AnalyticsView from './AnalyticsView'
import InstallView from './InstallView'
import OrganizationFilter from './OrganizationFilter'
import { Organization } from '../types/admin'
import { useOrganizationFilter } from '../contexts/OrganizationFilterContext'

interface DashboardLayoutProps {
  onLogout: () => void
}

const navigationItems = [
  { id: 'overview', name: 'Overview', icon: Home, description: 'Dashboard overview' },
  { id: 'organizations', name: 'Organizations', icon: Building2, description: 'Manage clients' },
  { id: 'users', name: 'Users', icon: Users, description: 'User management' },
  { id: 'agents', name: 'Agents', icon: Bot, description: 'AI agents' },
  { id: 'tasks', name: 'Tasks', icon: Calendar, description: 'Scheduled tasks' },
  { id: 'pipelines', name: 'Pipelines', icon: Workflow, description: 'Workflows' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Insights & reports' },
  { id: 'health', name: 'System Health', icon: Heart, description: 'System monitoring' },
  { id: 'install', name: 'Install App', icon: Sparkles, description: 'Install & setup guide' },
  { id: 'settings', name: 'Settings', icon: Settings, description: 'Configuration' },
]

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { selectedOrganizations, setSelectedOrganizations } = useOrganizationFilter()

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            // Focus search
            break
          case '1':
            e.preventDefault()
            setActiveView('overview')
            break
          case '2':
            e.preventDefault()
            setActiveView('organizations')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveView} />
      case 'organizations':
        return <OrganizationsView />
      case 'users':
        return <UsersView />
      case 'agents':
        return <AgentsView />
      case 'tasks':
        return <TasksView />
      case 'pipelines':
        return <PipelinesView />
      case 'analytics':
        return <AnalyticsView />
      case 'health':
        return <HealthView />
      case 'install':
        return <InstallView />
      case 'settings':
        return <div className="p-6"><div className="text-center py-12"><p className="text-gray-600 dark:text-gray-400">Settings panel coming soon</p></div></div>
      default:
        return <DashboardOverview onNavigate={setActiveView} />
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-dark-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-xl border-r border-gray-200 dark:border-dark-700 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3 h-3 text-warning-500 animate-bounce-light" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">GeniusAI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {navigationItems.find(item => item.id === activeView)?.name || 'Dashboard'}
                </h2>
                <div className="hidden sm:block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                  Live
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Organization Filter */}
              <OrganizationFilter
                selectedOrganizations={selectedOrganizations}
                onSelectionChange={setSelectedOrganizations}
                className="w-80"
              />

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-success-700 dark:text-success-300">
                  System Healthy
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-900">
          <div className="p-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  )
} 
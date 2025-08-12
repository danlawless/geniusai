'use client'

import { useState } from 'react'
import { 
  Download,
  Slack,
  Key,
  CheckCircle,
  ArrowRight,
  Copy,
  ExternalLink,
  Shield,
  Zap,
  Users,
  Bot,
  Sparkles,
  Globe,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

const WORKER_URL = 'https://geniusai-v2-worker.dan-30f.workers.dev'

interface InstallStep {
  id: string
  title: string
  description: string
  icon: any
  status: 'pending' | 'active' | 'completed'
}

export default function InstallView() {
  const [currentStep, setCurrentStep] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [isInstalling, setIsInstalling] = useState(false)
  const [installationComplete, setInstallationComplete] = useState(false)
  const [organizationId, setOrganizationId] = useState('')
  const [error, setError] = useState('')

  const steps: InstallStep[] = [
    {
      id: 'install',
      title: 'Install GeniusAI',
      description: 'Add GeniusAI to your Slack workspace',
      icon: Slack,
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : 'pending'
    },
    {
      id: 'configure',
      title: 'Configure OpenAI',
      description: 'Connect your OpenAI API key',
      icon: Key,
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      id: 'complete',
      title: 'Start Using',
      description: 'Your AI workspace is ready',
      icon: CheckCircle,
      status: currentStep === 2 ? 'active' : 'pending'
    }
  ]

  const handleSlackInstall = () => {
    setIsInstalling(true)
    // Generate unique state for OAuth security
    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('oauth_state', state)
    
    const slackInstallUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || 'your-client-id'}&scope=app_mentions:read,channels:history,channels:read,chat:write,commands,groups:history,groups:read,im:history,im:read,im:write,mpim:history,mpim:read,team:read,users:read,users:read.email&user_scope=&redirect_uri=${encodeURIComponent(WORKER_URL + '/slack/oauth')}&state=${state}`
    
    window.open(slackInstallUrl, 'slack-install', 'width=600,height=600')
    
    // Listen for installation completion
    const checkInstallation = setInterval(() => {
      const completed = localStorage.getItem('installation_completed')
      const orgId = localStorage.getItem('organization_id')
      
      if (completed && orgId) {
        setOrganizationId(orgId)
        setCurrentStep(1)
        setIsInstalling(false)
        localStorage.removeItem('installation_completed')
        clearInterval(checkInstallation)
      }
    }, 1000)
    
    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkInstallation)
      setIsInstalling(false)
    }, 300000)
  }

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key (starts with sk-)')
      return
    }
    
    try {
      setIsInstalling(true)
      
      const response = await fetch(`${WORKER_URL}/api/config/openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: organizationId,
          api_key: apiKey
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        // Show validation success details
        console.log('✅ API key validated successfully:', result.validation)
        setCurrentStep(2)
        setInstallationComplete(true)
      } else {
        // Better error messages from validation
        if (result.details) {
          setError(`${result.error}: ${result.details}`)
        } else {
          setError(result.message || result.error || 'Failed to save API key')
        }
      }
    } catch (err: any) {
      console.error('❌ Error configuring OpenAI:', err)
      setError(`Network error: ${err.message}`)
    } finally {
      setIsInstalling(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Install GeniusAI
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Transform your Slack workspace into an AI-powered productivity hub
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Agents</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create custom AI assistants for different tasks and departments
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Automation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automate workflows and tasks with intelligent pipelines
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enhanced team communication with AI-powered insights
          </p>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.status === 'active'
            const isCompleted = step.status === 'completed'
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-blue-500 border-blue-500 text-white' :
                  'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="text-center">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Install GeniusAI to Slack
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Add GeniusAI to your Slack workspace to get started with AI-powered productivity
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      Secure Installation
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      GeniusAI uses OAuth 2.0 for secure authentication. We only request the minimum permissions needed to function.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSlackInstall}
                disabled={isInstalling}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-slack text-white rounded-lg font-semibold hover:bg-slack-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4A154B' }}
              >
                {isInstalling ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <Slack className="w-5 h-5" />
                    <span>Add to Slack</span>
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                By installing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Configure OpenAI Integration
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your OpenAI API key to power your AI agents
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Key className="w-6 h-6 text-amber-600 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      Get Your OpenAI API Key
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                      You'll need an OpenAI API key to use AI features. Don't have one yet?
                    </p>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:underline"
                    >
                      <span>Get API Key from OpenAI</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div className="text-left">
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OpenAI API Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="api-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your API key is encrypted and stored securely
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isInstalling || !apiKey}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInstalling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating API Key...</span>
                    </>
                  ) : (
                    <>
                      <span>Validate & Save</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Installation Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  GeniusAI is now ready to use in your Slack workspace
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
                  🎉 What's Next?
                </h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Go to your Slack workspace</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Type <code className="bg-green-200 dark:bg-green-800 px-1 rounded">/help</code> to see available commands</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Try <code className="bg-green-200 dark:bg-green-800 px-1 rounded">/agents</code> to create your first AI agent</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.open('https://slack.com/app_redirect?app=your-app-id', '_blank')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-slack text-white rounded-lg font-semibold hover:bg-slack-dark transition-colors"
                  style={{ backgroundColor: '#4A154B' }}
                >
                  <Slack className="w-4 h-4" />
                  <span>Open Slack</span>
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Need help with installation?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            View Documentation
          </a>
          <span className="text-gray-300">•</span>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Contact Support
          </a>
          <span className="text-gray-300">•</span>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Join Community
          </a>
        </div>
      </div>
    </div>
  )
} 
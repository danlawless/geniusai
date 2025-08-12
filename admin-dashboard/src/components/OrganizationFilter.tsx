'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Building2, Hash, Users, X } from 'lucide-react'
import api from '../lib/api'
import { Organization } from '../types/admin'

interface OrganizationFilterProps {
  selectedOrganizations: Organization[]
  onSelectionChange: (organizations: Organization[]) => void
  className?: string
}

export default function OrganizationFilter({ selectedOrganizations, onSelectionChange, className = '' }: OrganizationFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await api.getOrganizations()
      const orgs = response.organizations || response
      setOrganizations(orgs)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(org => {
    const searchLower = searchTerm.toLowerCase()
    return (
      org.team_name.toLowerCase().includes(searchLower) ||
      org.slack_team_id.toLowerCase().includes(searchLower) ||
      org.id.toLowerCase().includes(searchLower)
    )
  })

  const handleOrganizationToggle = (org: Organization) => {
    const isSelected = selectedOrganizations.some(selected => selected.id === org.id)
    
    if (isSelected) {
      // Remove from selection
      const newSelection = selectedOrganizations.filter(selected => selected.id !== org.id)
      onSelectionChange(newSelection)
    } else {
      // Add to selection
      onSelectionChange([...selectedOrganizations, org])
    }
  }

  const handleRemoveOrganization = (orgId: string) => {
    const newSelection = selectedOrganizations.filter(org => org.id !== orgId)
    onSelectionChange(newSelection)
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600'
      case 'suspended': return 'text-yellow-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedOrganizations.length === 0 
              ? 'All Organizations' 
              : selectedOrganizations.length === 1
                ? selectedOrganizations[0].team_name
                : `${selectedOrganizations.length} Organizations Selected`
            }
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Selected Organizations Pills */}
      {selectedOrganizations.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOrganizations.map(org => (
            <div key={org.id} className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              <Building2 className="w-3 h-3" />
              <span className="font-medium">{org.team_name}</span>
              <button
                onClick={() => handleRemoveOrganization(org.id)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selectedOrganizations.length > 1 && (
            <button
              onClick={handleClearAll}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-dark-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, Slack ID, or team ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Organizations List */}
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading organizations...
              </div>
            ) : filteredOrganizations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No organizations found' : 'No organizations available'}
              </div>
            ) : (
              filteredOrganizations.map(org => {
                const isSelected = selectedOrganizations.some(selected => selected.id === org.id)
                
                return (
                  <button
                    key={org.id}
                    onClick={() => handleOrganizationToggle(org)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-600 last:border-b-0 transition-colors ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Building2 className={`w-4 h-4 ${getStatusColor(org.status)}`} />
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            {org.team_name}
                          </span>
                          {isSelected && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Hash className="w-3 h-3" />
                            <span>{org.slack_team_id}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{org.user_count || 0} users</span>
                          </div>
                          <span className={`capitalize ${getStatusColor(org.status)}`}>
                            {org.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
} 
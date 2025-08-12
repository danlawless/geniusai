'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Organization } from '../types/admin'

interface OrganizationFilterContextType {
  selectedOrganizations: Organization[]
  setSelectedOrganizations: (organizations: Organization[]) => void
  isFiltered: boolean
}

const OrganizationFilterContext = createContext<OrganizationFilterContextType | undefined>(undefined)

export function OrganizationFilterProvider({ children }: { children: ReactNode }) {
  const [selectedOrganizations, setSelectedOrganizations] = useState<Organization[]>([])

  // Load persistent organization filter from localStorage
  useEffect(() => {
    try {
      const savedOrganizations = localStorage.getItem('admin-dashboard-selected-organizations')
      if (savedOrganizations) {
        setSelectedOrganizations(JSON.parse(savedOrganizations))
      }
    } catch (error) {
      console.error('Error loading saved organizations:', error)
    }
  }, [])

  // Save organization filter to localStorage whenever it changes
  const handleOrganizationSelectionChange = (organizations: Organization[]) => {
    setSelectedOrganizations(organizations)
    try {
      localStorage.setItem('admin-dashboard-selected-organizations', JSON.stringify(organizations))
    } catch (error) {
      console.error('Error saving organizations:', error)
    }
  }

  const value = {
    selectedOrganizations,
    setSelectedOrganizations: handleOrganizationSelectionChange,
    isFiltered: selectedOrganizations.length > 0
  }

  return (
    <OrganizationFilterContext.Provider value={value}>
      {children}
    </OrganizationFilterContext.Provider>
  )
}

export function useOrganizationFilter() {
  const context = useContext(OrganizationFilterContext)
  if (context === undefined) {
    throw new Error('useOrganizationFilter must be used within an OrganizationFilterProvider')
  }
  return context
} 
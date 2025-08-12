'use client'

import { Grid3X3, List } from 'lucide-react'

interface ViewToggleProps {
  view: 'list' | 'card'
  onViewChange: (view: 'list' | 'card') => void
  className?: string
}

export default function ViewToggle({ view, onViewChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange('card')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'card'
            ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Cards
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <List className="w-4 h-4 mr-2" />
        List
      </button>
    </div>
  )
} 
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Settings, 
  Eye, 
  EyeOff,
  GripVertical,
  Check
} from 'lucide-react'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  hideable?: boolean
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableData {
  [key: string]: any
}

interface EnhancedTableProps {
  columns: TableColumn[]
  data: TableData[]
  onRowClick?: (row: TableData) => void
  className?: string
  tableId: string // Unique ID for persisting settings
}

interface ColumnSettings {
  visible: boolean
  order: number
}

interface TableSettings {
  columnSettings: { [key: string]: ColumnSettings }
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
}

export default function EnhancedTable({ 
  columns, 
  data, 
  onRowClick, 
  className = '', 
  tableId 
}: EnhancedTableProps) {
  const [settings, setSettings] = useState<TableSettings>({
    columnSettings: {},
    sortColumn: undefined,
    sortDirection: undefined
  })
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  // Initialize settings from localStorage or defaults
  useEffect(() => {
    const savedSettings = localStorage.getItem(`table-settings-${tableId}`)
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error('Error parsing saved table settings:', error)
        initializeDefaultSettings()
      }
    } else {
      initializeDefaultSettings()
    }
  }, [tableId, columns])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(settings.columnSettings).length > 0) {
      localStorage.setItem(`table-settings-${tableId}`, JSON.stringify(settings))
    }
  }, [settings, tableId])

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowColumnSettings(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initializeDefaultSettings = () => {
    const columnSettings: { [key: string]: ColumnSettings } = {}
    columns.forEach((col, index) => {
      columnSettings[col.key] = {
        visible: true,
        order: index
      }
    })
    setSettings({
      columnSettings,
      sortColumn: undefined,
      sortDirection: undefined
    })
  }

  // Get ordered and visible columns
  const getVisibleColumns = () => {
    return columns
      .filter(col => settings.columnSettings[col.key]?.visible !== false)
      .sort((a, b) => {
        const orderA = settings.columnSettings[a.key]?.order ?? 0
        const orderB = settings.columnSettings[b.key]?.order ?? 0
        return orderA - orderB
      })
  }

  // Sort data based on current sort settings
  const getSortedData = () => {
    if (!settings.sortColumn || !settings.sortDirection) {
      return data
    }

    return [...data].sort((a, b) => {
      const aVal = a[settings.sortColumn!]
      const bVal = b[settings.sortColumn!]
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      // Convert to strings for comparison if not already
      const aStr = typeof aVal === 'string' ? aVal : String(aVal)
      const bStr = typeof bVal === 'string' ? bVal : String(bVal)

      const comparison = aStr.localeCompare(bStr, undefined, { numeric: true })
      return settings.sortDirection === 'asc' ? comparison : -comparison
    })
  }

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column?.sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    
    if (settings.sortColumn === columnKey) {
      if (settings.sortDirection === 'asc') {
        newDirection = 'desc'
      } else if (settings.sortDirection === 'desc') {
        // Reset sorting
        setSettings(prev => ({
          ...prev,
          sortColumn: undefined,
          sortDirection: undefined
        }))
        return
      }
    }

    setSettings(prev => ({
      ...prev,
      sortColumn: columnKey,
      sortDirection: newDirection
    }))
  }

  const toggleColumnVisibility = (columnKey: string) => {
    setSettings(prev => ({
      ...prev,
      columnSettings: {
        ...prev.columnSettings,
        [columnKey]: {
          ...prev.columnSettings[columnKey],
          visible: !prev.columnSettings[columnKey]?.visible
        }
      }
    }))
  }

  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedColumn(columnKey)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault()
    setDragOverColumn(columnKey)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault()
    
    if (!draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null)
      setDragOverColumn(null)
      return
    }

    // Reorder columns
    const visibleColumns = getVisibleColumns()
    const draggedIndex = visibleColumns.findIndex(col => col.key === draggedColumn)
    const targetIndex = visibleColumns.findIndex(col => col.key === targetColumnKey)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    // Create new order
    const newColumnSettings = { ...settings.columnSettings }
    
    // Get the items to reorder
    const draggedCol = visibleColumns[draggedIndex]
    const updatedColumns = [...visibleColumns]
    
    // Remove dragged item and insert at target position
    updatedColumns.splice(draggedIndex, 1)
    updatedColumns.splice(targetIndex, 0, draggedCol)
    
    // Update order values
    updatedColumns.forEach((col, index) => {
      newColumnSettings[col.key] = {
        ...newColumnSettings[col.key],
        order: index
      }
    })

    setSettings(prev => ({
      ...prev,
      columnSettings: newColumnSettings
    }))

    setDraggedColumn(null)
    setDragOverColumn(null)
  }

  const getSortIcon = (columnKey: string) => {
    if (settings.sortColumn !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    
    return settings.sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />
  }

  const visibleColumns = getVisibleColumns()
  const sortedData = getSortedData()

  return (
    <div className={`relative ${className}`}>
      {/* Table Settings Button */}
      <div className="flex justify-end mb-4">
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Table Settings
          </button>

          {/* Column Settings Dropdown */}
          {showColumnSettings && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Column Visibility
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {columns.map(column => (
                    <label 
                      key={column.key}
                      className="flex items-center space-x-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 rounded px-2 py-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={settings.columnSettings[column.key]?.visible !== false}
                        onChange={() => toggleColumnVisibility(column.key)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!column.hideable && settings.columnSettings[column.key]?.visible !== false}
                      />
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {column.label}
                      </span>
                      {settings.columnSettings[column.key]?.visible !== false ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </label>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-600">
                  <button
                    onClick={() => {
                      initializeDefaultSettings()
                      setShowColumnSettings(false)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  draggable
                  onClick={() => handleSort(column.key)}
                  onDragStart={(e) => handleDragStart(e, column.key)}
                  onDragOver={(e) => handleDragOver(e, column.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.key)}
                  style={{ width: column.width }}
                  className={`
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700' : ''}
                    ${dragOverColumn === column.key ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    ${draggedColumn === column.key ? 'opacity-50' : ''}
                    relative select-none transition-colors
                  `}
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                      <span>{column.label}</span>
                    </div>
                    {column.sortable && (
                      <div className="flex items-center ml-2">
                        {getSortIcon(column.key)}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr 
                key={row.id || index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700' : ''}
              >
                {visibleColumns.map((column) => (
                  <td key={column.key}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      )}
    </div>
  )
} 
import React, { useState, useEffect, useCallback } from 'react'
import Header             from './components/Header'
import DashboardConsultor from './pages/DashboardConsultor'
import ErrorBoundary      from './components/ErrorBoundary'
import { useTheme }       from './hooks/useTheme'
import './App.css'

const REFRESH_MS = 60 * 60 * 1000

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(() => new Date().toISOString())
  const { theme, toggle } = useTheme()

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
    setLastUpdate(new Date().toISOString())
  }, [])

  useEffect(() => {
    const t = setInterval(handleRefresh, REFRESH_MS)
    return () => clearInterval(t)
  }, [handleRefresh])

  return (
    <ErrorBoundary>
      <div className="app">
        <Header
          onRefresh={handleRefresh}
          lastUpdate={lastUpdate}
          theme={theme}
          onThemeToggle={toggle}
        />
        <ErrorBoundary>
          <DashboardConsultor key={refreshKey} />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}

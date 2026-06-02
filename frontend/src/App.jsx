import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import DashboardConsultor from './pages/DashboardConsultor'
import './App.css'

const REFRESH_INTERVAL_MS = 60 * 60 * 1000

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
    setLastUpdate(new Date().toISOString())
  }, [])

  useEffect(() => {
    const t = setInterval(handleRefresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(t)
  }, [handleRefresh])

  return (
    <div className="app">
      <Header onRefresh={handleRefresh} lastUpdate={lastUpdate} />
      <DashboardConsultor key={refreshKey} />
    </div>
  )
}

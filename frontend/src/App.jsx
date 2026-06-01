import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import DashboardConsultor from './pages/DashboardConsultor'
import './App.css'

const REFRESH_INTERVAL_MS = 60 * 60 * 1000 // 1 hora (igual ao sistema atual)

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
    setLastUpdate(new Date().toISOString())
  }, [])

  // Auto-refresh a cada 1 hora
  useEffect(() => {
    const timer = setInterval(handleRefresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [handleRefresh])

  return (
    <div className="app">
      <Header onRefresh={handleRefresh} lastUpdate={lastUpdate} />
      <DashboardConsultor key={refreshKey} onRefresh={handleRefresh} />
    </div>
  )
}

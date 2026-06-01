import React from 'react'
import './Header.css'

export default function Header({ onRefresh, lastUpdate }) {
  const hoje = new Date().toLocaleDateString('pt-BR')

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <span className="header-logo-leaf">🌱</span>
          <span className="header-logo-text">Adubos Real</span>
        </div>
        <div className="header-divider" />
        <h1 className="header-title">Dashboard Consultor</h1>
      </div>

      <div className="header-right">
        {lastUpdate && (
          <span className="header-update">
            Atualizado: {new Date(lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <span className="header-date">{hoje}</span>
        <button className="header-refresh" onClick={onRefresh} title="Recarregar dados">
          ↻
        </button>
      </div>
    </header>
  )
}

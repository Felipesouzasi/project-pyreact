import React from 'react'
import './Header.css'

export default function Header({ onRefresh, lastUpdate }) {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
  const hora = lastUpdate
    ? new Date(lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="hdr-brand">
          <span className="hdr-icon">🌱</span>
          <span className="hdr-name">Adubos Real</span>
        </div>
        <div className="hdr-sep" />
        <span className="hdr-page">Dashboard Consultor</span>
      </div>

      <div className="hdr-right">
        {hora && <span className="hdr-update">Atualizado: {hora}</span>}
        <span className="hdr-date">{hoje}</span>
        <button className="hdr-btn" onClick={onRefresh} title="Atualizar dados">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

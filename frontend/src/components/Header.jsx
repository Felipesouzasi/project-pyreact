import React, { useState } from 'react'
import './Header.css'

const INITIALS = 'FS'

export default function Header({ onRefresh, lastUpdate, theme, onThemeToggle }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const isDark = theme === 'dark'

  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
  const hora = lastUpdate
    ? new Date(lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="hdr-brand">
          <div className="hdr-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4ade80" opacity=".15"/>
              <path d="M12 3c-.8 2-3 4-3 7 0 1.66 1.34 3 3 3s3-1.34 3-3c0-3-2.2-5-3-7z" fill="#4ade80"/>
              <path d="M9 17c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1H9v1z" fill="#4ade80" opacity=".6"/>
            </svg>
          </div>
          <div className="hdr-brand-text">
            <span className="hdr-brand-name">Adubos Real</span>
            <span className="hdr-brand-dot" />
            <span className="hdr-brand-module">Consultor</span>
          </div>
        </div>

        <div className="hdr-divider" />

        <div className="hdr-breadcrumb">
          <span className="hdr-bc-home">Dashboard</span>
          <span className="hdr-bc-sep">›</span>
          <span className="hdr-bc-current">Visão Geral</span>
        </div>
      </div>

      <div className="hdr-right">
        <div className="hdr-time">
          {hora && <span className="hdr-time-clock">⏱ {hora}</span>}
          <span className="hdr-time-date">{hoje}</span>
        </div>

        {/* toggle dark/light */}
        <button
          className="hdr-icon-btn hdr-theme-btn"
          onClick={onThemeToggle}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
          aria-label="Alternar tema"
        >
          {isDark ? (
            /* sol */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            /* lua */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* refresh */}
        <button className="hdr-icon-btn" onClick={onRefresh} title="Atualizar dados">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>

        {/* notificações */}
        <div className="hdr-notif-wrap">
          <button className="hdr-icon-btn hdr-notif-btn"
            onClick={() => setNotifOpen(o => !o)} title="Notificações">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="hdr-notif-dot" />
          </button>

          {notifOpen && (
            <div className="hdr-notif-panel">
              <div className="hdr-notif-header">
                <span>Notificações</span>
                <button onClick={() => setNotifOpen(false)}>✕</button>
              </div>
              <div className="hdr-notif-item hdr-notif-item--info">
                <span className="hdr-notif-icon">📊</span>
                <div>
                  <strong>Dados atualizados</strong>
                  <p>Dashboard sincronizado às {hora ?? '--:--'}</p>
                </div>
              </div>
              <div className="hdr-notif-item hdr-notif-item--warn">
                <span className="hdr-notif-icon">⚠️</span>
                <div>
                  <strong>Metas em risco</strong>
                  <p>Verifique os grupos abaixo de 75%</p>
                </div>
              </div>
              <div className="hdr-notif-footer">Atualização automática a cada hora</div>
            </div>
          )}
        </div>

        {/* avatar */}
        <div className="hdr-avatar" title="Felipe Santos">
          <span>{INITIALS}</span>
          <span className="hdr-avatar-status" />
        </div>
      </div>
    </header>
  )
}

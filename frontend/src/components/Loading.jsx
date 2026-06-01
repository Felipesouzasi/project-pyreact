import React from 'react'

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: 40, color: 'var(--texto-suave)',
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid var(--creme-dark)',
        borderTopColor: 'var(--verde-vivo)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: 13, fontFamily: 'var(--font-body)' }}>{text}</span>
    </div>
  )
}

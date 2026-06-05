import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', gap: 16, padding: 32,
          fontFamily: 'Inter, sans-serif',
        }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0d1a0d' }}>
            Algo deu errado
          </h2>
          <p style={{ fontSize: 13, color: '#7a8c7a', maxWidth: 340, textAlign: 'center' }}>
            {this.state.error?.message ?? 'Erro inesperado no carregamento.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: '#2a522a', color: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
            }}
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

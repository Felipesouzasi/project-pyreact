import React from 'react'
import './MetaCard.css'

function safeNum(v) { const n = Number(v); return isNaN(n) ? 0 : n }
const fmt = v => safeNum(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Cell({ label, value, variant }) {
  return (
    <div className={`mc-cell ${variant ? `mc-cell--${variant}` : ''}`}>
      <span className="mc-label">{label}</span>
      <span className="mc-val">{value}</span>
    </div>
  )
}

export default function MetaCard({ meta = 0, faturamento = 0, desvio = 0, carteira = 0 }) {
  const d = safeNum(desvio)
  const c = safeNum(carteira)
  return (
    <div className="mc">
      <div className="mc-row">
        <Cell label="Meta"        value={fmt(meta)}        />
        <Cell label="Faturamento" value={fmt(faturamento)} />
      </div>
      <div className="mc-row">
        <Cell label="Desvio"   value={fmt(d)} variant={d < 0 ? 'neg' : 'pos'} />
        <Cell label="Carteira" value={fmt(c)} variant={c > 0 ? 'pos' : undefined} />
      </div>
    </div>
  )
}

import React from 'react'
import './MetaCard.css'

const fmt = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Cell({ label, value, variant }) {
  const cls = variant === 'negative' ? 'mc-cell mc-cell--red'
            : variant === 'positive' ? 'mc-cell mc-cell--green'
            : 'mc-cell'
  return (
    <div className={cls}>
      <span className="mc-label">{label}</span>
      <span className="mc-val">{value}</span>
    </div>
  )
}

export default function MetaCard({ meta, faturamento, desvio, carteira }) {
  return (
    <div className="mc-wrap">
      <Cell label="Meta"        value={fmt(meta)}        />
      <Cell label="Faturamento" value={fmt(faturamento)} />
      <Cell label="Desvio"      value={fmt(desvio)}      variant={desvio < 0 ? 'negative' : 'positive'} />
      <Cell label="Carteira"    value={fmt(carteira)}    variant={carteira > 0 ? 'positive' : undefined} />
    </div>
  )
}

import React from 'react'
import './MetaCard.css'

function fmt(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function MetaCard({ meta, faturamento, desvio, carteira }) {
  return (
    <table className="meta-card">
      <tbody>
        <tr>
          <td className="mc-label">Meta</td>
          <td className="mc-value">{fmt(meta)}</td>
        </tr>
        <tr>
          <td className="mc-label">Faturamento</td>
          <td className="mc-value">{fmt(faturamento)}</td>
        </tr>
        <tr>
          <td className="mc-label">Desvio</td>
          <td className={`mc-value ${desvio < 0 ? 'negative' : 'positive'}`}>
            {fmt(desvio)}
          </td>
        </tr>
        <tr>
          <td className="mc-label">Carteira</td>
          <td className={`mc-value ${carteira > 0 ? 'positive' : 'neutral'}`}>
            {fmt(carteira)}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

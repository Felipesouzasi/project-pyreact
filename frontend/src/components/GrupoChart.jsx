import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import './GrupoChart.css'

const PALETTE = ['#22c55e','#16a34a','#15803d','#166534','#4ade80','#86efac','#bbf7d0']

const fmt = v => {
  const n = Number(v); if (isNaN(n)) return '0'
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n/1_000).toFixed(0)}k`
  return n.toLocaleString('pt-BR')
}

// Fix: percentual vem calculado no backend via subquery — campo: percentual_faturado
function getPct(row) {
  const v = row?.percentual_faturado ?? row?.percentual ?? null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function SafeTooltip({ active, payload }) {
  if (!active || !Array.isArray(payload) || !payload.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const pct = getPct(d)
  return (
    <div className="gc-tip">
      <strong>{d.grupo ?? '—'}</strong>
      <span>{Number(d.vlr_total_faturado ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      {pct !== null
        ? <span className="gc-tip-pct">{pct.toFixed(2)}% do total</span>
        : <span className="gc-tip-pct" style={{color:'var(--t3)'}}>calculando...</span>
      }
    </div>
  )
}

export default function GrupoChart({ data }) {
  const safe = Array.isArray(data) ? data : []

  if (!safe.length) return (
    <div className="gc card">
      <div className="gc-head">
        <div className="gc-title">Top Grupos de Produtos</div>
        <span className="gc-sub">Valor total faturado</span>
      </div>
      <div className="gc-empty">Nenhum dado disponível</div>
    </div>
  )

  return (
    <div className="gc card">
      <div className="gc-head">
        <div className="gc-title">Top Grupos de Produtos</div>
        <span className="gc-sub">Valor total faturado</span>
      </div>
      <div className="gc-body">
        <ResponsiveContainer width="100%" height={Math.max(200, safe.length * 46)}>
          <BarChart data={safe} layout="vertical" margin={{ top:4, right:56, bottom:4, left:8 }}>
            <XAxis type="number" tickFormatter={fmt}
              tick={{ fontSize:10, fill:'var(--gc-axis)', fontFamily:'DM Mono' }}
              axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="grupo" width={144}
              tick={{ fontSize:11, fill:'var(--gc-label)', fontFamily:'DM Sans' }}
              axisLine={false} tickLine={false}/>
            <Tooltip content={<SafeTooltip/>} cursor={{ fill:'var(--gc-cursor)' }}/>
            <Bar dataKey="vlr_total_faturado" radius={[0,6,6,0]} barSize={20}
              isAnimationActive={false}
              label={{ position:'right', formatter:fmt, fontSize:11,
                fill:'var(--gc-label)', fontFamily:'Space Grotesk', fontWeight:600 }}>
              {safe.map((_,i) => <Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

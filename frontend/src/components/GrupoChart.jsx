import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import './GrupoChart.css'

const PALETTE = ['#1e3a1e','#2a522a','#386838','#4a8a4a','#6aaa6a','#9ccc9c','#c0e0c0']

const fmt = v =>
  v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `${(v/1_000).toFixed(0)}k`
  : String(v)

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="gc-tip">
      <strong>{d.grupo}</strong>
      <span>{Number(d.vlr_total_faturado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      <span className="gc-tip-pct">{d.percentual_faturado}% do total</span>
    </div>
  )
}

export default function GrupoChart({ data = [] }) {
  const h = Math.max(220, data.length * 46)
  return (
    <div className="gc card">
      <div className="gc-head">
        <div className="gc-title">Top Grupos de Produtos</div>
        <span className="gc-sub">Valor total faturado</span>
      </div>
      <div className="gc-body">
        <ResponsiveContainer width="100%" height={h}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 60, bottom: 4, left: 8 }}>
            <XAxis type="number" tickFormatter={fmt}
              tick={{ fontSize: 10, fill: 'var(--t3)', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="grupo" width={148}
              tick={{ fontSize: 11, fill: 'var(--t2)', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} cursor={{ fill: 'var(--g50)' }} />
            <Bar dataKey="vlr_total_faturado" radius={[0, 6, 6, 0]} barSize={20}
              label={{ position:'right', formatter: fmt, fontSize: 11,
                       fill:'var(--t2)', fontFamily:'Space Grotesk', fontWeight:600 }}>
              {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

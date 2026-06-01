import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import './GrupoChart.css'

const COLORS = ['#3d7a34', '#5a9e50', '#7dc464', '#a8d98e', '#c8eab2', '#dff2cc', '#eef8e6']

function fmtMoeda(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}k`
  return v.toLocaleString('pt-BR')
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { grupo, vlr_total_faturado, percentual_faturado } = payload[0].payload
  return (
    <div className="gc-tooltip">
      <strong>{grupo}</strong>
      <span>{Number(vlr_total_faturado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      <span className="gc-tt-perc">{percentual_faturado}%</span>
    </div>
  )
}

export default function GrupoChart({ data = [] }) {
  return (
    <div className="gc-wrapper card">
      <div className="dt-header" style={{ marginBottom: 12 }}>
        <span className="section-title">Top Grupos de Produtos</span>
      </div>

      <p className="gc-subtitle">Vlr Total Faturado (Soma)</p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 8 }}
        >
          <XAxis
            type="number"
            tickFormatter={fmtMoeda}
            tick={{ fontSize: 10, fill: '#888', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="grupo"
            width={130}
            tick={{ fontSize: 10, fill: '#555', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f2eb' }} />
          <Bar dataKey="vlr_total_faturado" radius={[0, 6, 6, 0]} barSize={20} label={{
            position: 'right',
            formatter: fmtMoeda,
            fontSize: 10,
            fill: '#555',
            fontFamily: 'DM Sans',
          }}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

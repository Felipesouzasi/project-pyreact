import React from 'react'
import './Velocimetro.css'

const VW = 260, VH = 160
const CX = VW / 2, CY = VH - 12
const R_OUT = 100, R_IN = 78
const Rm = (R_OUT + R_IN) / 2
const SW = R_OUT - R_IN  // stroke width = 22

function clamp(v) { const n = Number(v); return isNaN(n) ? 0 : Math.max(0, Math.min(100, n)) }
function toRad(p) { return Math.PI * (p / 100 - 1) }  // 0%=-π, 100%=0
function pt(rad, r) { return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) } }

function arcD(a0, a1, r) {
  // garante que o arco nunca seja degenerado (a0 === a1 → linha reta)
  const delta = a1 - a0
  if (Math.abs(delta) < 0.001) return null
  const s = pt(a0, r), e = pt(a1, r)
  const large = delta > Math.PI ? 1 : 0
  return `M${s.x.toFixed(3)} ${s.y.toFixed(3)} A${r} ${r} 0 ${large} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`
}

const SEGS  = [
  { from: 0,  to: 73, color: '#ef4444' },
  { from: 75, to: 88, color: '#f59e0b' },
  { from: 90, to: 100,color: '#22c55e' },
]
const TICKS = [0, 25, 50, 75, 100]

export default function Velocimetro({ titulo = '', perc = 0 }) {
  const pct   = clamp(perc)
  const nRad  = toRad(pct)
  const color = pct >= 90 ? '#22c55e' : pct >= 75 ? '#f59e0b' : '#ef4444'
  const glow  = pct >= 90 ? 'rgba(34,197,94,.4)'  : pct >= 75 ? 'rgba(245,158,11,.4)' : 'rgba(239,68,68,.4)'

  const tipPt = pt(nRad, R_IN - 4)
  const b1    = pt(nRad + Math.PI / 2, 4)
  const b2    = pt(nRad - Math.PI / 2, 4)

  // arco de progresso limpo — sem forçar mínimo, sem round nas pontas
  const progressD = pct > 0 ? arcD(-Math.PI, nRad, Rm) : null

  const uid = `v${Math.round(pct * 10)}_${titulo.replace(/\s/g,'').slice(0,6)}`

  return (
    <div className="vel">
      <div className="vel-status" style={{ background: color, boxShadow: `0 0 10px ${glow}` }} />
      <span className="vel-title">{titulo || '—'}</span>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="vel-svg" aria-label={`${titulo}: ${pct.toFixed(1)}%`}>
        <defs>
          <filter id={uid} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* trilho fundo */}
        <path d={arcD(-Math.PI, 0, Rm) ?? ''} fill="none"
          stroke="var(--vel-track)" strokeWidth={SW} strokeLinecap="butt"/>

        {/* faixas de cor (sempre visíveis, opacidade baixa) */}
        {SEGS.map(s => {
          const d = arcD(toRad(s.from), toRad(s.to), Rm)
          return d ? (
            <path key={s.from} d={d} fill="none" stroke={s.color}
              strokeWidth={SW} strokeLinecap="butt" opacity=".22"/>
          ) : null
        })}

        {/* progresso luminoso */}
        {progressD && (
          <path d={progressD} fill="none" stroke={color}
            strokeWidth={SW - 8} strokeLinecap="butt" opacity=".92"
            filter={`url(#${uid})`}
            style={{ transition: 'all .85s cubic-bezier(.34,1.1,.64,1)' }}/>
        )}

        {/* ticks */}
        {TICKS.map(t => {
          const p = pt(toRad(t), R_OUT + 13)
          return (
            <text key={t} x={p.x} y={p.y} textAnchor="middle"
              dominantBaseline="middle" fontSize="8.5"
              fill="var(--t3)" fontFamily="'DM Mono', monospace" fontWeight="500">
              {t}%
            </text>
          )
        })}

        {/* agulha */}
        <polygon
          points={`${tipPt.x},${tipPt.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`}
          fill={color} opacity=".95"
          style={{
            transition: 'all .85s cubic-bezier(.34,1.1,.64,1)',
            filter: `drop-shadow(0 0 3px ${glow})`,
          }}/>

        {/* pivô */}
        <circle cx={CX} cy={CY} r={9} fill="var(--vel-bg)"
          stroke="var(--vel-border)" strokeWidth={1.5}/>
        <circle cx={CX} cy={CY} r={3.5} fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>

        {/* valor */}
        <text x={CX} y={CY - 30} textAnchor="middle"
          fontSize="21" fontWeight="700" fill={color}
          fontFamily="'Space Grotesk', sans-serif" letterSpacing="-.5"
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}>
          {pct.toFixed(1)}%
        </text>
      </svg>
    </div>
  )
}

import React from 'react'
import './Velocimetro.css'

/* ── geometria ────────────────────────────────────────────────── */
const VW = 280, VH = 170
const CX = VW / 2, CY = VH - 18
const R  = 110, THICK = 22
const Rm = R - THICK / 2          // raio do centro da trilha

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }
function toRad(perc) { return Math.PI * (clamp(perc, 0, 100) / 100 - 1) }
function xy(rad, r) { return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) } }
function arc(a0, a1, r) {
  const s = xy(a0, r), e = xy(a1, r)
  const lg = a1 - a0 > Math.PI ? 1 : 0
  return `M${s.x} ${s.y} A${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
}

const SEGS = [
  { from: 0,  to: 75,  fill: '#e53e3e' },
  { from: 75, to: 90,  fill: '#d97706' },
  { from: 90, to: 100, fill: '#16a34a' },
]
const MARKS = [0, 25, 50, 75, 100]

/* ── componente ───────────────────────────────────────────────── */
export default function Velocimetro({ titulo, perc = 0 }) {
  const pct      = clamp(perc, 0, 100)
  const needRad  = toRad(pct)
  const tip      = xy(needRad, Rm - 10)
  const b1       = xy(needRad + Math.PI / 2, 5)
  const b2       = xy(needRad - Math.PI / 2, 5)

  const color = pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#e53e3e'
  const bgAcc = pct >= 90 ? 'var(--ok-bg)' : pct >= 75 ? 'var(--warn-bg)' : 'var(--danger-bg)'

  return (
    <div className="vel" style={{ '--c': color, '--bg': bgAcc }}>
      <span className="vel-title">{titulo}</span>

      <svg viewBox={`0 0 ${VW} ${VH}`} className="vel-svg" role="img" aria-label={`${titulo}: ${pct.toFixed(1)}%`}>
        {/* trilho cinza */}
        <path d={arc(-Math.PI, 0, Rm)} fill="none" stroke="var(--border)" strokeWidth={THICK} strokeLinecap="butt" />

        {/* faixas de cor */}
        {SEGS.map(s => (
          <path key={s.from} d={arc(toRad(s.from), toRad(s.to), Rm)}
            fill="none" stroke={s.fill} strokeWidth={THICK} strokeLinecap="butt" opacity=".88" />
        ))}

        {/* progresso luminoso */}
        {pct > 0 && (
          <path d={arc(-Math.PI, needRad, Rm)}
            fill="none" stroke={color} strokeWidth={THICK - 10}
            strokeLinecap="butt" opacity=".3" />
        )}

        {/* ticks */}
        {MARKS.map(m => {
          const r = toRad(m)
          const p = xy(r, R + 16)
          return (
            <text key={m} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="var(--t3)" fontFamily="Inter,sans-serif" fontWeight="500">
              {m}%
            </text>
          )
        })}

        {/* agulha */}
        <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`}
          fill={color} style={{ transition: 'all .9s cubic-bezier(.34,1.1,.64,1)' }} />

        {/* pivô */}
        <circle cx={CX} cy={CY} r={11} fill="var(--surface)" stroke={color} strokeWidth={2.5} />
        <circle cx={CX} cy={CY} r={4.5} fill={color} />

        {/* valor */}
        <text x={CX} y={CY - 34} textAnchor="middle"
          fontSize="20" fontWeight="700" fill={color}
          fontFamily="Space Grotesk,sans-serif" letterSpacing="-.5">
          {pct.toFixed(1)}%
        </text>
      </svg>
    </div>
  )
}

import React from 'react'
import './Velocimetro.css'

/**
 * Velocímetro semicircular desenhado 100% em SVG nativo.
 * Nenhuma lib de terceiros necessária.
 */

const W = 260
const H = 160
const CX = W / 2
const CY = H - 10
const R  = 105

// Converte porcentagem (0–100) → ângulo em radianos no semicírculo
// 0% = -180° (esquerda), 100% = 0° (direita)
function percToRad(perc) {
  const clamped = Math.min(Math.max(perc, 0), 100)
  return Math.PI * (clamped / 100 - 1)  // -π a 0
}

function polarToXY(anglRad, r = R) {
  return {
    x: CX + r * Math.cos(anglRad),
    y: CY + r * Math.sin(anglRad),
  }
}

function arcPath(startRad, endRad, r, rx = r) {
  const s = polarToXY(startRad, r)
  const e = polarToXY(endRad, r)
  const large = endRad - startRad > Math.PI ? 1 : 0
  return `M ${s.x} ${s.y} A ${rx} ${rx} 0 ${large} 1 ${e.x} ${e.y}`
}

// Segmentos de cor (0–75 vermelho, 75–90 amarelo, 90–100 verde)
const SEGMENTS = [
  { from: 0,  to: 75,  color: '#e05252' },
  { from: 75, to: 90,  color: '#f0a830' },
  { from: 90, to: 100, color: '#4caf72' },
]

// Marcadores de texto nos ângulos 0%, 25%, 50%, 75%, 100%
const TICKS = [0, 25, 50, 75, 100]

export default function Velocimetro({ titulo, perc = 0 }) {
  const needleRad = percToRad(perc)
  const needleTip = polarToXY(needleRad, R - 18)

  // Cor do valor baseada no %
  const valueColor =
    perc >= 90 ? '#4caf72' :
    perc >= 75 ? '#f0a830' :
                 '#e05252'

  return (
    <div className="velocimetro-wrapper fade-up">
      <h3 className="velocimetro-titulo">{titulo}</h3>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="velocimetro-svg"
        aria-label={`${titulo}: ${perc}%`}
      >
        {/* Trilho de fundo */}
        <path
          d={arcPath(Math.PI * -1, 0, R)}
          fill="none"
          stroke="#e8e4da"
          strokeWidth={18}
          strokeLinecap="butt"
        />

        {/* Segmentos coloridos */}
        {SEGMENTS.map(seg => (
          <path
            key={seg.from}
            d={arcPath(percToRad(seg.from), percToRad(seg.to), R)}
            fill="none"
            stroke={seg.color}
            strokeWidth={18}
            strokeLinecap="butt"
            opacity={0.92}
          />
        ))}

        {/* Marcadores de texto */}
        {TICKS.map(t => {
          const rad = percToRad(t)
          const { x, y } = polarToXY(rad, R + 18)
          return (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#888"
              fontFamily="DM Sans, sans-serif"
            >
              {t}%
            </text>
          )
        })}

        {/* Agulha */}
        <line
          x1={CX}
          y1={CY}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#1a2e1a"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ transition: 'all 0.8s cubic-bezier(.34,1.56,.64,1)' }}
        />
        {/* Pivô */}
        <circle cx={CX} cy={CY} r={5} fill="#1a2e1a" />

        {/* Valor percentual */}
        <text
          x={CX}
          y={CY - 18}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill={valueColor}
          fontFamily="Syne, sans-serif"
        >
          {perc.toFixed(2)}%
        </text>
      </svg>
    </div>
  )
}

import React from 'react'

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', gap:12, padding:48,
      color:'var(--t3)', width:'100%',
    }}>
      <div style={{
        width:28, height:28,
        border:'2px solid var(--border2)',
        borderTopColor:'var(--green)',
        borderRadius:'50%',
        animation:'spin .7s linear infinite',
      }}/>
      <span style={{ fontSize:12, fontFamily:'DM Mono, monospace' }}>{text}</span>
    </div>
  )
}

import React from 'react'

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', gap:12, padding:48,
      color:'var(--t3)', width:'100%',
    }}>
      <div style={{
        width:32, height:32,
        border:'3px solid var(--border)',
        borderTopColor:'var(--g500)',
        borderRadius:'50%',
        animation:'spin .75s linear infinite',
      }} />
      <span style={{ fontSize:13, fontFamily:'var(--sans)' }}>{text}</span>
    </div>
  )
}

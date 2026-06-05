import React, { useState } from 'react'
import ErrorBoundary  from '../components/ErrorBoundary'
import Velocimetro    from '../components/Velocimetro'
import MetaCard       from '../components/MetaCard'
import DataTable      from '../components/DataTable'
import GrupoChart     from '../components/GrupoChart'
import Loading        from '../components/Loading'
import {
  useMetas, useTopClientes, useTopProdutos,
  useTopGrupos, useTopSubgrupos, CONSULTOR_ID,
} from '../hooks/useConsultor'
import './DashboardConsultor.css'

/* ── helpers ──────────────────────────────────────────────── */
function safeNum(v) { const n = Number(v); return isNaN(n) ? 0 : n }

const fmt = v => safeNum(v).toLocaleString('pt-BR', {
  minimumFractionDigits: 2, maximumFractionDigits: 2,
})

const fmtPct = v => {
  if (v === null || v === undefined) return '—'
  const n = Number(v)
  return isNaN(n) ? '—' : `${n.toFixed(2)}%`
}

const hoje = () => new Date().toLocaleDateString('pt-BR')

/* DSC badge — dias_ultima_compra pode vir null da view */
function DscBadge({ dias }) {
  if (dias === null || dias === undefined) {
    return (
      <span style={{
        display:'inline-block', padding:'2px 9px', borderRadius:6,
        fontSize:11, fontWeight:700, fontFamily:'var(--mono)',
        background:'rgba(255,255,255,.05)', color:'var(--t3)',
        border:'1px solid var(--border)',
      }}>—</span>
    )
  }
  const n  = safeNum(dias)
  const ok = n < 180
  return (
    <span style={{
      display:'inline-block', padding:'2px 9px', borderRadius:6,
      fontSize:11, fontWeight:700, fontFamily:'DM Mono, monospace',
      background: ok ? 'rgba(34,197,94,.1)'  : 'rgba(239,68,68,.1)',
      color:      ok ? '#4ade80'             : '#f87171',
      border:    `1px solid ${ok ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.2)'}`,
    }}>{n}</span>
  )
}

function Err({ msg }) {
  return <div className="dc-err">Erro: {msg ?? 'tente novamente'}</div>
}

/* ── Seção Metas ──────────────────────────────────────────── */
function SecaoMetas({ cid }) {
  const { data, loading, error } = useMetas(cid)
  if (loading) return <Loading text="Carregando metas..." />
  if (error)   return <Err msg={error} />

  const grupos = Array.isArray(data?.data) ? data.data : []
  const row1   = grupos.slice(0, 4)
  const row2   = grupos.slice(4)
  const mes    = new Date().toLocaleDateString('pt-BR', { month:'long', year:'numeric' })

  if (!grupos.length) return (
    <section className="dc-sec">
      <div className="dc-sec-hdr"><h2 className="dc-sec-title">Metas do Mês</h2></div>
      <p style={{ color:'var(--t3)', fontSize:13 }}>Nenhuma meta para este período.</p>
    </section>
  )

  const Gauge = ({ g, delay }) => (
    <div className="dc-gauge" style={{ animationDelay:`${delay}ms` }}>
      <ErrorBoundary>
        <Velocimetro titulo={g.grupo ?? ''} perc={safeNum(g.perc_meta)} />
        <MetaCard
          meta={g.vlr_meta} faturamento={g.vlr_faturamento}
          desvio={g.desvio} carteira={g.vlr_carteira}
        />
      </ErrorBoundary>
    </div>
  )

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr">
        <h2 className="dc-sec-title">Metas do Mês</h2>
        <span className="dc-sec-sub">{mes}</span>
      </div>
      <div className="dc-g4">
        {row1.map((g,i) => g && <Gauge key={g.grupo??i} g={g} delay={i*55} />)}
      </div>
      {row2.length > 0 && (
        <div className="dc-g3">
          {row2.map((g,i) => g && <Gauge key={g.grupo??i} g={g} delay={(i+4)*55} />)}
        </div>
      )}
    </section>
  )
}

/* ── Seção Ranking ────────────────────────────────────────── */
function SecaoRanking({ cid }) {
  const [pgC, setPgC] = useState(1)
  const [pgP, setPgP] = useState(1)
  const PS = 10

  const cli = useTopClientes(cid, pgC, PS)
  const prd = useTopProdutos(cid, pgP, PS)

  const colC = [
    { key:'cliente',            label:'Cliente' },
    { key:'vlr_total_faturado', label:'Total',  render: v => fmt(v) },
    { key:'percentual',         label:'%',      render: v => fmtPct(v) },
    { key:'dias_ultima_compra', label:'DSC',    render: v => <DscBadge dias={v} /> },
  ]
  const colP = [
    { key:'produto',            label:'Produto' },
    { key:'vlr_total_faturado', label:'Total',  render: v => fmt(v) },
    { key:'percentual',         label:'%',      render: v => fmtPct(v) },
    { key:'dias_ultima_compra', label:'DSC',    render: v => <DscBadge dias={v} /> },
  ]

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr"><h2 className="dc-sec-title">Ranking</h2></div>
      <div className="dc-g2">
        <ErrorBoundary>
          {cli.loading ? <Loading /> : cli.error ? <Err msg={cli.error} /> : (
            <DataTable title="Top Clientes" date={hoje()} columns={colC}
              rows={Array.isArray(cli.data?.data) ? cli.data.data : []}
              total={safeNum(cli.data?.total)} page={pgC} pageSize={PS} onPageChange={setPgC} />
          )}
        </ErrorBoundary>
        <ErrorBoundary>
          {prd.loading ? <Loading /> : prd.error ? <Err msg={prd.error} /> : (
            <DataTable title="Top Produtos" date={hoje()} columns={colP}
              rows={Array.isArray(prd.data?.data) ? prd.data.data : []}
              total={safeNum(prd.data?.total)} page={pgP} pageSize={PS} onPageChange={setPgP} />
          )}
        </ErrorBoundary>
      </div>
    </section>
  )
}

/* ── Seção Produtos ───────────────────────────────────────── */
function SecaoProdutos({ cid }) {
  const [pgS, setPgS] = useState(1)
  const PS = 12

  const grp = useTopGrupos(cid)
  const sub = useTopSubgrupos(cid, pgS, PS)

  // percentual_faturado vem do backend calculado via subquery
  const colS = [
    { key:'subgrupo',            label:'Subgrupo' },
    { key:'vlr_total_faturado',  label:'Valor Total', render: v => fmt(v) },
    { key:'percentual_faturado', label:'%',           render: v => fmtPct(v) },
  ]

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr"><h2 className="dc-sec-title">Produtos</h2></div>
      <div className="dc-g2">
        <ErrorBoundary>
          {grp.loading ? <Loading /> : grp.error ? <Err msg={grp.error} /> : (
            <GrupoChart data={Array.isArray(grp.data?.data) ? grp.data.data : []} />
          )}
        </ErrorBoundary>
        <ErrorBoundary>
          {sub.loading ? <Loading /> : sub.error ? <Err msg={sub.error} /> : (
            <DataTable title="Top Subgrupos" date={hoje()} columns={colS}
              rows={Array.isArray(sub.data?.data) ? sub.data.data : []}
              total={safeNum(sub.data?.total)} page={pgS} pageSize={PS} onPageChange={setPgS} />
          )}
        </ErrorBoundary>
      </div>
    </section>
  )
}

/* ── Dashboard ────────────────────────────────────────────── */
export default function DashboardConsultor() {
  return (
    <main className="dc">
      <ErrorBoundary><SecaoMetas    cid={CONSULTOR_ID} /></ErrorBoundary>
      <ErrorBoundary><SecaoRanking  cid={CONSULTOR_ID} /></ErrorBoundary>
      <ErrorBoundary><SecaoProdutos cid={CONSULTOR_ID} /></ErrorBoundary>
    </main>
  )
}

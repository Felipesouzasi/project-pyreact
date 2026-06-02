import React, { useState } from 'react'
import Velocimetro  from '../components/Velocimetro'
import MetaCard     from '../components/MetaCard'
import DataTable    from '../components/DataTable'
import GrupoChart   from '../components/GrupoChart'
import Loading      from '../components/Loading'
import {
  useMetas, useTopClientes, useTopProdutos,
  useTopGrupos, useTopSubgrupos, CONSULTOR_ID,
} from '../hooks/useConsultor'
import './DashboardConsultor.css'

/* ── helpers ──────────────────────────────────────────────── */
const fmt = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 })
const hoje = () => new Date().toLocaleDateString('pt-BR')

function DscBadge({ dias }) {
  const ok = Number(dias) < 180
  return (
    <span style={{
      display:'inline-block', padding:'2px 9px', borderRadius:6,
      fontSize:12, fontWeight:700,
      background: ok ? 'var(--ok-bg)'     : 'var(--danger-bg)',
      color:       ok ? 'var(--ok)'        : 'var(--danger)',
      border:     `1px solid ${ok ? 'var(--ok-border)' : 'var(--danger-border)'}`,
    }}>{dias}</span>
  )
}

function Err({ msg }) {
  return <div className="dc-err">Erro: {msg}</div>
}

/* ── Seção 1 – Metas ──────────────────────────────────────── */
function SecaoMetas({ cid }) {
  const { data, loading, error } = useMetas(cid)
  if (loading) return <Loading text="Carregando metas..." />
  if (error)   return <Err msg={error} />

  const grupos = data?.data ?? []
  const row1 = grupos.slice(0, 4)
  const row2 = grupos.slice(4)
  const mes  = new Date().toLocaleDateString('pt-BR', { month:'long', year:'numeric' })

  const Gauge = ({ g, delay }) => (
    <div className="dc-gauge" style={{ animationDelay:`${delay}ms` }}>
      <Velocimetro titulo={g.grupo} perc={g.perc_meta} />
      <MetaCard
        meta={g.vlr_meta}
        faturamento={g.vlr_faturamento}
        desvio={g.desvio}
        carteira={g.vlr_carteira}
      />
    </div>
  )

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr">
        <h2 className="dc-sec-title">Metas do Mês</h2>
        <span className="dc-sec-sub">{mes}</span>
      </div>
      <div className="dc-g4">
        {row1.map((g,i) => <Gauge key={g.grupo} g={g} delay={i*55} />)}
      </div>
      {row2.length > 0 && (
        <div className="dc-g3">
          {row2.map((g,i) => <Gauge key={g.grupo} g={g} delay={(i+4)*55} />)}
        </div>
      )}
    </section>
  )
}

/* ── Seção 2 – Ranking ────────────────────────────────────── */
function SecaoRanking({ cid }) {
  const [pgC, setPgC] = useState(1)
  const [pgP, setPgP] = useState(1)
  const PS = 10

  const cli = useTopClientes(cid, pgC, PS)
  const prd = useTopProdutos(cid, pgP, PS)

  const colC = [
    { key:'cliente',            label:'Cliente' },
    { key:'vlr_total_faturado', label:'Total',  render: v => fmt(v) },
    { key:'percentual',         label:'%',      render: v => `${v}%` },
    { key:'dias_ultima_compra', label:'DSC',    render: v => <DscBadge dias={v} /> },
  ]
  const colP = [
    { key:'produto',            label:'Produto' },
    { key:'vlr_total_faturado', label:'Total',  render: v => fmt(v) },
    { key:'percentual',         label:'%',      render: v => `${v}%` },
    { key:'dias_ultima_compra', label:'DSC',    render: v => <DscBadge dias={v} /> },
  ]

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr">
        <h2 className="dc-sec-title">Ranking</h2>
      </div>
      <div className="dc-g2">
        {cli.loading ? <Loading /> : cli.error ? <Err msg={cli.error} /> : (
          <DataTable title="Top Clientes" date={hoje()} columns={colC}
            rows={cli.data?.data??[]} total={cli.data?.total??0}
            page={pgC} pageSize={PS} onPageChange={setPgC} />
        )}
        {prd.loading ? <Loading /> : prd.error ? <Err msg={prd.error} /> : (
          <DataTable title="Top Produtos" date={hoje()} columns={colP}
            rows={prd.data?.data??[]} total={prd.data?.total??0}
            page={pgP} pageSize={PS} onPageChange={setPgP} />
        )}
      </div>
    </section>
  )
}

/* ── Seção 3 – Produtos ───────────────────────────────────── */
function SecaoProdutos({ cid }) {
  const [pgS, setPgS] = useState(1)
  const PS = 12

  const grp = useTopGrupos(cid)
  const sub = useTopSubgrupos(cid, pgS, PS)

  const colS = [
    { key:'subgrupo',            label:'Subgrupo' },
    { key:'vlr_total_faturado',  label:'Valor Total', render: v => fmt(v) },
    { key:'percentual_faturado', label:'%',           render: v => `${v}%` },
  ]

  return (
    <section className="dc-sec">
      <div className="dc-sec-hdr">
        <h2 className="dc-sec-title">Produtos</h2>
      </div>
      <div className="dc-g2">
        {grp.loading ? <Loading /> : grp.error ? <Err msg={grp.error} /> : (
          <GrupoChart data={grp.data?.data??[]} />
        )}
        {sub.loading ? <Loading /> : sub.error ? <Err msg={sub.error} /> : (
          <DataTable title="Top Subgrupos" date={hoje()} columns={colS}
            rows={sub.data?.data??[]} total={sub.data?.total??0}
            page={pgS} pageSize={PS} onPageChange={setPgS} />
        )}
      </div>
    </section>
  )
}

/* ── Dashboard ────────────────────────────────────────────── */
export default function DashboardConsultor() {
  return (
    <main className="dc">
      <SecaoMetas    cid={CONSULTOR_ID} />
      <SecaoRanking  cid={CONSULTOR_ID} />
      <SecaoProdutos cid={CONSULTOR_ID} />
    </main>
  )
}

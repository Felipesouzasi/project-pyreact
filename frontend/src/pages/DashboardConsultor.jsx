import React, { useState, useEffect, useCallback } from 'react'
import Velocimetro from '../components/Velocimetro'
import MetaCard from '../components/MetaCard'
import DataTable from '../components/DataTable'
import GrupoChart from '../components/GrupoChart'
import Loading from '../components/Loading'
import {
  useMetas,
  useTopClientes,
  useTopProdutos,
  useTopGrupos,
  useTopSubgrupos,
  CONSULTOR_ID,
} from '../hooks/useConsultor'
import './DashboardConsultor.css'

// Helpers
function fmt(v) {
  return Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function DiasBadge({ dias }) {
  const ok = dias < 180
  return (
    <span style={{ color: ok ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
      {dias}
    </span>
  )
}

// ─── Seção de Velocímetros ────────────────────────────────────────────────────
function SecaoMetas({ consultorId }) {
  const { data, loading, error, reload } = useMetas(consultorId)

  if (loading) return <Loading text="Carregando metas..." />
  if (error)   return <p className="dc-error">Erro: {error}</p>

  const grupos = data?.data ?? []

  return (
    <section className="dc-section">
      <div className="dc-section-header">
        <span className="section-title">Metas do Mês</span>
        <span className="dc-mes">
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="dc-velocimetros">
        {grupos.map((g, i) => (
          <div
            key={g.grupo}
            className="dc-velocimetro-item"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Velocimetro
              titulo={g.grupo.replace('FERTILIZANTES ', 'FERT. ')}
              perc={g.perc_meta}
            />
            <MetaCard
              meta={g.vlr_meta}
              faturamento={g.vlr_faturamento}
              desvio={g.desvio}
              carteira={g.vlr_carteira}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Seção Top Clientes + Top Produtos ───────────────────────────────────────
function SecaoTopTabelas({ consultorId }) {
  const [pageClientes,  setPageClientes]  = useState(1)
  const [pageProdutos,  setPageProdutos]  = useState(1)
  const PAGE_SIZE = 10

  const clientes = useTopClientes(consultorId, pageClientes, PAGE_SIZE)
  const produtos  = useTopProdutos(consultorId, pageProdutos, PAGE_SIZE)

  const hoje = new Date().toLocaleDateString('pt-BR')

  const colClientes = [
    { key: 'cliente',           label: 'Cliente'      },
    { key: 'vlr_total_faturado', label: 'Total',       render: v => fmt(v) },
    { key: 'percentual',        label: '%',            render: v => `${v}%` },
    { key: 'dias_ultima_compra', label: 'DSC',         render: v => <DiasBadge dias={v} /> },
  ]

  const colProdutos = [
    { key: 'produto',            label: 'Produto'      },
    { key: 'vlr_total_faturado', label: 'Total',       render: v => fmt(v) },
    { key: 'percentual',        label: '%',            render: v => `${v}%` },
    { key: 'dias_ultima_compra', label: 'DSC',         render: v => <DiasBadge dias={v} /> },
  ]

  return (
    <section className="dc-section">
      <div className="dc-dois-paineis">
        {clientes.loading ? <Loading /> : clientes.error ? <p className="dc-error">{clientes.error}</p> : (
          <DataTable
            title="Top Clientes"
            date={hoje}
            columns={colClientes}
            rows={clientes.data?.data ?? []}
            total={clientes.data?.total ?? 0}
            page={pageClientes}
            pageSize={PAGE_SIZE}
            onPageChange={setPageClientes}
          />
        )}

        {produtos.loading ? <Loading /> : produtos.error ? <p className="dc-error">{produtos.error}</p> : (
          <DataTable
            title="Top Produtos"
            date={hoje}
            columns={colProdutos}
            rows={produtos.data?.data ?? []}
            total={produtos.data?.total ?? 0}
            page={pageProdutos}
            pageSize={PAGE_SIZE}
            onPageChange={setPageProdutos}
          />
        )}
      </div>
    </section>
  )
}

// ─── Seção Grupos + Subgrupos ─────────────────────────────────────────────────
function SecaoGrupos({ consultorId }) {
  const [pageSubgrupos, setPageSubgrupos] = useState(1)
  const PAGE_SIZE = 12

  const grupos    = useTopGrupos(consultorId)
  const subgrupos = useTopSubgrupos(consultorId, pageSubgrupos, PAGE_SIZE)

  const hoje = new Date().toLocaleDateString('pt-BR')

  const colSubgrupos = [
    { key: 'subgrupo',           label: 'Subgrupo'   },
    { key: 'vlr_total_faturado', label: 'Valor Total', render: v => fmt(v) },
    { key: 'percentual_faturado', label: '%',          render: v => `${v}%` },
  ]

  return (
    <section className="dc-section">
      <div className="dc-dois-paineis">
        {grupos.loading ? <Loading /> : grupos.error ? <p className="dc-error">{grupos.error}</p> : (
          <GrupoChart data={grupos.data?.data ?? []} />
        )}

        {subgrupos.loading ? <Loading /> : subgrupos.error ? <p className="dc-error">{subgrupos.error}</p> : (
          <DataTable
            title="Top Subgrupos de Produtos"
            date={hoje}
            columns={colSubgrupos}
            rows={subgrupos.data?.data ?? []}
            total={subgrupos.data?.total ?? 0}
            page={pageSubgrupos}
            pageSize={PAGE_SIZE}
            onPageChange={setPageSubgrupos}
          />
        )}
      </div>
    </section>
  )
}

// ─── Dashboard Principal ──────────────────────────────────────────────────────
export default function DashboardConsultor({ onRefresh }) {
  return (
    <main className="dc-main">
      <SecaoMetas    consultorId={CONSULTOR_ID} />
      <SecaoTopTabelas consultorId={CONSULTOR_ID} />
      <SecaoGrupos   consultorId={CONSULTOR_ID} />
    </main>
  )
}

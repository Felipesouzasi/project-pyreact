import React from 'react'
import './DataTable.css'

export default function DataTable({ title, date, columns, rows, total, page, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize) || 1
  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  // janela de páginas centrada no atual
  const win = []
  const lo = Math.max(1, Math.min(page - 2, totalPages - 4))
  for (let p = lo; p <= Math.min(lo + 4, totalPages); p++) win.push(p)

  return (
    <div className="dt card">
      {/* cabeçalho */}
      <div className="dt-head">
        <div className="dt-title">{title}</div>
        <span className="dt-date">{date}</span>
      </div>

      {/* tabela */}
      <div className="dt-scroll">
        <table className="dt-tbl">
          <thead>
            <tr>
              <th className="dt-th dt-th-n">#</th>
              {columns.map(c => <th key={c.key} className="dt-th">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td className="dt-empty" colSpan={columns.length + 1}>Nenhum registro encontrado</td></tr>
              : rows.map((row, i) => (
                <tr key={i} className="dt-row">
                  <td className="dt-td dt-td-n">
                    <span className="dt-badge">{from + i}</span>
                  </td>
                  {columns.map(c => (
                    <td key={c.key} className="dt-td">
                      {c.render ? c.render(row[c.key], row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* rodapé paginação */}
      <div className="dt-foot">
        <span className="dt-info">{from}–{to} de {total}</span>
        <div className="dt-pages">
          <button className="dt-pg" onClick={() => onPageChange(1)}       disabled={page === 1}>«</button>
          <button className="dt-pg" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</button>
          {win.map(p => (
            <button key={p} className={`dt-pg${p === page ? ' dt-pg--on' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
          ))}
          <button className="dt-pg" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</button>
          <button className="dt-pg" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </div>
  )
}

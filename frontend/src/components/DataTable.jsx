import React from 'react'
import './DataTable.css'

export default function DataTable({
  title,
  date,
  columns,      // [{ key, label, render? }]
  rows,
  total,
  page,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="dt-wrapper card">
      <div className="dt-header">
        <span className="section-title">{title}</span>
        <span className="dt-date">{date}</span>
      </div>

      <div className="dt-scroll">
        <table className="dt-table">
          <thead>
            <tr>
              <th className="dt-th dt-num">#</th>
              {columns.map(c => (
                <th key={c.key} className="dt-th">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="dt-row">
                <td className="dt-td dt-num dt-rank">
                  {(page - 1) * pageSize + i + 1}
                </td>
                {columns.map(c => (
                  <td key={c.key} className="dt-td">
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="dt-pagination">
        <span className="dt-info">
          {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total}
        </span>
        <div className="dt-pages">
          <button
            className="dt-btn"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >«</button>
          <button
            className="dt-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >‹</button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
            return p <= totalPages ? (
              <button
                key={p}
                className={`dt-btn ${p === page ? 'dt-btn--active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            ) : null
          })}

          <button
            className="dt-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >›</button>
          <button
            className="dt-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >»</button>
        </div>
      </div>
    </div>
  )
}

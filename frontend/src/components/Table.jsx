import React from 'react'

export default function Table ({ columns, data, emptyMessage = 'Nenhum registro encontrado.' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-600/40 bg-surface-200/60">
      <table className="min-w-full divide-y divide-neutral-600/40">
        <thead className="bg-surface-300/80">
          <tr>
            {columns.map(column => (
              <th
                key={column.accessor}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-600/30 bg-surface-200/40 text-sm">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-neutral-400">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="transition hover:bg-surface-100/60">
              {columns.map(column => (
                <td key={column.accessor} className="px-4 py-3 text-neutral-200">
                  {column.Cell ? column.Cell(row[column.accessor], row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

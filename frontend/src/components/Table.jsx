import React from 'react'

export default function Table ({ columns, data, emptyMessage = 'Nenhum registro encontrado.' }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.accessor}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-sm">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50">
              {columns.map(column => (
                <td key={column.accessor} className="px-4 py-3 text-slate-600">
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

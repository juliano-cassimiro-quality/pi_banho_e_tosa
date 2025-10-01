import React from 'react'

export default function PageHeader ({ title, description, actions }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
          Painel Banho &amp; Tosa
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

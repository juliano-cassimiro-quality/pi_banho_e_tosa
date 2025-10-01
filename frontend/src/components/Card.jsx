import React from 'react'
import clsx from 'clsx'

export default function Card ({ title, actions, children, className }) {
  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

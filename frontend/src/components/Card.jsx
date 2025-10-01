import React from 'react'
import clsx from 'clsx'

export default function Card ({ title, actions, children, className }) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur',
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

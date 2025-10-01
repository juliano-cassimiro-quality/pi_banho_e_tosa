import React from 'react'
import clsx from 'clsx'

export default function Card ({ title, actions, children, className }) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-neutral-600/40 bg-surface-200/80 p-6 shadow-card backdrop-blur-xs',
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

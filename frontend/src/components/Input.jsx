import React from 'react'
import clsx from 'clsx'

export default function Input ({ label, description, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-neutral-300">
      {label && <span className="text-xs font-semibold uppercase tracking-wide text-neutral-300">{label}</span>}
      {description && <span className="text-xs text-neutral-500">{description}</span>}
      <input
        className={clsx(
          'rounded-xl border border-neutral-600/60 bg-surface-100/70 px-4 py-2.5 text-sm text-neutral-100 shadow-card placeholder-neutral-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:ring-offset-2 focus:ring-offset-ink-900',
          error && 'border-danger-500/80 focus:border-danger-500 focus:ring-danger-500/40',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-danger-500">{error}</span>}
    </label>
  )
}

import React from 'react'
import clsx from 'clsx'

const colors = {
  blue: 'from-accent-500/90 to-accent-700/90',
  green: 'from-success-500/90 to-success-600/90',
  violet: 'from-accent-400/90 to-accent-600/90',
  orange: 'from-warning-500/90 to-warning-600/90',
  red: 'from-danger-500/90 to-danger-600/90'
}

export default function StatsCard ({ label, value, color = 'blue' }) {
  const gradient = colors[color] || colors.blue

  return (
    <div className="rounded-3xl border border-neutral-600/40 bg-surface-200/80 p-6 shadow-card backdrop-blur-xs">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
      <div
        className={clsx(
          'mt-4 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r px-5 py-2 text-3xl font-semibold text-white shadow-elevated',
          gradient
        )}
      >
        <span>{value}</span>
      </div>
    </div>
  )
}

import React from 'react'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-900 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-accent-500 text-white shadow-elevated hover:bg-accent-600 focus:ring-accent-300 focus-visible:outline-none',
  secondary:
    'border border-neutral-600 bg-surface-200/80 text-neutral-100 shadow-card hover:border-neutral-400 hover:text-white focus:ring-accent-400',
  ghost:
    'text-neutral-300 hover:bg-surface-100/70 focus:ring-accent-400',
  danger:
    'bg-danger-500 text-white shadow-card hover:bg-danger-600 focus:ring-danger-500'
}

export default function Button ({ variant = 'primary', className, children, ...props }) {
  const variantStyles = variants[variant] || variants.primary
  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  )
}

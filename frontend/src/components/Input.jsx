import React from 'react'
import clsx from 'clsx'

export default function Input ({ label, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
      {label && <span>{label}</span>}
      <input
        className={clsx(
          'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs font-normal text-red-500">{error}</span>}
    </label>
  )
}

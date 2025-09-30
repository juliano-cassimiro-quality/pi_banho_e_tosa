import React from 'react'
import clsx from 'clsx'

const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 focus:ring-primary-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
}

export default function Button ({ variant = 'primary', className, children, ...props }) {
  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}

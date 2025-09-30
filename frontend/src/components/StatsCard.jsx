import React from 'react'
import clsx from 'clsx'

const colors = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  orange: 'bg-orange-50 text-orange-700',
  red: 'bg-red-50 text-red-700'
}

export default function StatsCard ({ label, value, color = 'blue' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={clsx('mt-2 text-3xl font-semibold', colors[color] || colors.blue)}>{value}</p>
    </div>
  )
}

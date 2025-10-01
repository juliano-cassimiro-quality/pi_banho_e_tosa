import React from 'react'
import clsx from 'clsx'

const colors = {
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-emerald-500 to-teal-500',
  violet: 'from-violet-500 to-purple-500',
  orange: 'from-orange-500 to-amber-500',
  red: 'from-rose-500 to-red-500'
}

export default function StatsCard ({ label, value, color = 'blue' }) {
  const gradient = colors[color] || colors.blue

  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className={clsx('mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-2 text-white shadow-lg', gradient)}>
        <span className="text-3xl font-semibold">{value}</span>
      </div>
    </div>
  )
}

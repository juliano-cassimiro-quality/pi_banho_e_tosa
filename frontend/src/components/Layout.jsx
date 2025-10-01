import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'
import useAuth from '../hooks/useAuth'
import Button from './Button'
import clsx from 'clsx'

const clientNavigation = [
  { name: 'Agendamentos', to: '/app/agendamentos' },
  { name: 'Agendar serviço', to: '/app/agendar' },
  { name: 'Pets', to: '/app/pets' }
]

const professionalNavigation = [
  { name: 'Agenda do dia', to: '/app/gestao' },
  { name: 'Agendamentos', to: '/app/agendamentos' },
  { name: 'Pets', to: '/app/pets' }
]

function NavItem ({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        clsx(
          'rounded-full px-4 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-accent-500 text-white shadow-elevated'
            : 'text-neutral-300 hover:bg-surface-100/70 hover:text-white'
        )
      }
    >
      {item.name}
    </NavLink>
  )
}

export default function Layout () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigationItems = user?.role === 'profissional' ? professionalNavigation : clientNavigation

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-neutral-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(40% 60% at 0% 0%, rgba(124, 109, 255, 0.25), transparent), radial-gradient(50% 70% at 100% 15%, rgba(60, 66, 115, 0.35), transparent)',
          backgroundColor: '#050611'
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Disclosure as="header" className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          {() => (
            <>
              <div className="flex items-center justify-between rounded-[32px] border border-neutral-600/40 bg-surface-200/70 px-5 py-4 shadow-card backdrop-blur">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-lg font-semibold text-white">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500 text-xl font-bold text-white shadow-elevated">
                      BT
                    </span>
                    Espaço Banho &amp; Tosa
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    {navigationItems.map(item => (
                      <NavItem key={item.name} item={item} />
                    ))}
                  </div>
                </div>
                <div className="hidden items-center gap-4 md:flex">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">Bem-vindo</p>
                    <p className="text-sm font-semibold text-white">{user?.nome}</p>
                  </div>
                  <Button variant="secondary" onClick={handleLogout} className="rounded-full px-5 py-2">
                    Sair
                  </Button>
                </div>
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-2xl border border-neutral-600/40 bg-surface-100/70 p-2 text-neutral-300 shadow-card focus:outline-none focus:ring-2 focus:ring-accent-400">
                    <Bars3Icon className="h-6 w-6" />
                  </Disclosure.Button>
                </div>
              </div>
              <Disclosure.Panel className="mt-3 space-y-2 rounded-3xl border border-neutral-600/40 bg-surface-200/80 p-4 shadow-card backdrop-blur md:hidden">
                {navigationItems.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      clsx(
                        'block rounded-2xl px-4 py-2 text-base font-medium transition',
                        isActive
                          ? 'bg-accent-500 text-white shadow-elevated'
                          : 'text-neutral-300 hover:bg-surface-100/70 hover:text-white'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-2xl border border-danger-500/30 px-4 py-2 text-center text-base font-medium text-danger-500 transition hover:bg-danger-500/10"
                >
                  Sair
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-neutral-600/40 bg-surface-200/70 p-8 shadow-elevated backdrop-blur">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-neutral-700/60 bg-surface-200/60 py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-neutral-400 sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Espaço Banho &amp; Tosa. Cuidado premium em cada detalhe.</p>
            <p className="text-neutral-300">
              Atendimento realizado com todo cuidado para cada pet e tutor.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'
import useAuth from '../hooks/useAuth'
import Button from './Button'
import ChatbotWidget from './ChatbotWidget'

const clientNavigation = [
  { name: 'Agendamentos', to: '/app/agendamentos' },
  { name: 'Agendar serviço', to: '/app/agendar' },
  { name: 'Pets', to: '/app/pets' }
]

const professionalNavigation = [
  { name: 'Gestão', to: '/app/gestao' },
  { name: 'Agendamentos', to: '/app/agendamentos' },
  { name: 'Pets', to: '/app/pets' }
]

const adminNavigation = [
  { name: 'Dashboard', to: '/app/dashboard' },
  { name: 'Agendamentos', to: '/app/agendamentos' },
  { name: 'Agendar serviço', to: '/app/agendar' },
  { name: 'Pets', to: '/app/pets' },
  { name: 'Gestão', to: '/app/gestao' }
]

function NavItem ({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200/60'
            : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
        }`
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

  const navigationItems =
    user?.role === 'admin'
      ? adminNavigation
      : user?.role === 'profissional'
        ? professionalNavigation
        : clientNavigation

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-50 via-white to-primary-50">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-primary-200/40 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Disclosure as="header" className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          {() => (
            <>
              <div className="flex items-center justify-between rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-lg font-semibold text-primary-700">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-md">BT</span>
                    Espaço Premium
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    {navigationItems.map(item => (
                      <NavItem key={item.name} item={item} />
                    ))}
                  </div>
                </div>
                <div className="hidden items-center gap-4 md:flex">
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Bem-vindo</p>
                    <p className="text-sm font-semibold text-slate-700">{user?.nome}</p>
                  </div>
                  <Button variant="secondary" onClick={handleLogout} className="rounded-full border-white/60 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm">
                    Sair
                  </Button>
                </div>
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-full bg-white/80 p-2 text-slate-500 shadow focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Bars3Icon className="h-6 w-6" />
                  </Disclosure.Button>
                </div>
              </div>
              <Disclosure.Panel className="mt-3 space-y-2 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur md:hidden">
                {navigationItems.map(item => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-full px-4 py-2 text-base font-medium ${
                        isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-200/60' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-full px-4 py-2 text-center text-base font-medium text-red-600 transition hover:bg-red-50"
                >
                  Sair
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-white/60 bg-white/70 py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Banho &amp; Tosa Premium. Cuidado completo para cada pet.</p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-primary-600">Precisa de ajuda?</span>
              Fale com a Luma pelo chat.</p>
          </div>
        </footer>
        <ChatbotWidget />
      </div>
    </div>
  )
}

import React from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'
import useAuth from '../hooks/useAuth'
import Button from './Button'

const clientNavigation = [
  { name: 'Agendamentos', to: '/agendamentos' },
  { name: 'Agendar serviço', to: '/agendar' },
  { name: 'Pets', to: '/pets' },
  { name: 'Dashboard', to: '/dashboard' }
]

const professionalNavigation = [
  { name: 'Gestão', to: '/gestao' },
  { name: 'Dashboard', to: '/dashboard' }
]

function NavItem ({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
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
    navigate('/login')
  }

  const navigationItems = user?.role === 'profissional' ? professionalNavigation : clientNavigation

  return (
    <div className="min-h-screen bg-slate-50">
      <Disclosure as="nav" className="border-b border-slate-200 bg-white shadow-sm">
        {() => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-lg font-semibold text-primary-600">Banho &amp; Tosa</div>
                  <div className="hidden gap-2 md:flex">
                    {navigationItems.map(item => (
                      <NavItem key={item.name} item={item} />
                    ))}
                  </div>
                </div>
                <div className="hidden items-center gap-4 md:flex">
                  <span className="text-sm text-slate-600">Olá, {user?.nome}</span>
                  <Button variant="secondary" onClick={handleLogout}>Sair</Button>
                </div>
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Bars3Icon className="h-6 w-6" />
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="space-y-1 border-t border-slate-200 bg-white px-2 pb-3 pt-2 md:hidden">
              {navigationItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-base font-medium ${
                      isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sair
              </button>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage () {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4 py-16 text-neutral-100">
      <div className="w-full max-w-2xl space-y-6 rounded-[32px] border border-neutral-600/40 bg-surface-200/80 p-10 shadow-elevated backdrop-blur">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-white">Comece sua experiência premium</h1>
          <p className="text-sm text-neutral-400">
            Crie sua conta para acompanhar agendamentos, cadastrar pets e organizar os cuidados do seu animal em um só lugar.
          </p>
        </div>
        <RegisterForm showLoginLink={false} />
        <p className="text-center text-sm text-neutral-400">
          Já possui conta?
          {' '}
          <Link to="/login" className="font-medium text-accent-300 transition hover:text-accent-200">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}

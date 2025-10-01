import React from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage () {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white px-4">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Comece sua experiência premium</h1>
          <p className="mt-3 text-sm text-slate-500">
            Crie sua conta para acompanhar agendamentos, cadastrar pets e acessar o dashboard completo.
          </p>
        </div>
        <RegisterForm showLoginLink={false} />
        <p className="text-center text-sm text-slate-500">
          Já possui conta?
          {' '}
          <Link to="/login" className="font-medium text-primary-600 transition hover:text-primary-700">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}

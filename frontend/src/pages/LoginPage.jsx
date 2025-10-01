import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function LoginPage () {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Acesse sua conta</h1>
          <p className="mt-2 text-sm text-slate-500">Gerencie agendamentos de banho e tosa com facilidade.</p>
        </div>
        <LoginForm showRegisterLink={false} />
        <p className="text-center text-xs text-slate-400">
          Precisa de ajuda? Entre em contato pelo chat com a Luma ou envie um e-mail para{' '}
          <a href="mailto:contato@banhoetosa.com" className="font-medium text-primary-600 hover:text-primary-700">
            contato@banhoetosa.com
          </a>
        </p>
        <p className="text-center text-sm text-slate-500">
          Ainda não possui conta?
          <Link to="/cadastro" className="ml-1 font-medium text-primary-600 hover:text-primary-700">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

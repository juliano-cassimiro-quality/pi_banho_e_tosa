import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function LoginPage () {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4 py-16 text-neutral-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-neutral-600/40 bg-surface-200/80 p-8 shadow-elevated backdrop-blur">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-white">Acesse sua conta</h1>
          <p className="text-sm text-neutral-400">Gerencie agendamentos, pets e indicadores em um painel premium.</p>
        </div>
        <LoginForm showRegisterLink={false} />
        <p className="text-center text-xs text-neutral-500">
          Precisa de ajuda? Fale com a Luma no chat ou envie um e-mail para{' '}
          <a href="mailto:contato@banhoetosa.com" className="font-medium text-accent-300 hover:text-accent-200">
            contato@banhoetosa.com
          </a>
        </p>
        <p className="text-center text-sm text-neutral-400">
          Ainda não possui conta?
          <Link to="/cadastro" className="ml-1 font-medium text-accent-300 hover:text-accent-200">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

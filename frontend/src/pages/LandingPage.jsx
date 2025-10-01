import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import LandingScheduleWidget from '../components/LandingScheduleWidget'
import useAuth from '../hooks/useAuth'
import { getDefaultPath } from '../utils/navigation'
import Button from '../components/Button'

const stepItems = [
  {
    icon: UserCircleIcon,
    title: 'Crie sua conta e cadastre o pet',
    description: 'Informe seus dados, registre o animal com histórico de saúde e preferências para facilitar o atendimento.'
  },
  {
    icon: CalendarDaysIcon,
    title: 'Escolha data e horário disponíveis',
    description: 'Consulte a agenda atualizada do profissional e selecione o melhor momento para banho, tosa ou ambos.'
  },
  {
    icon: CheckCircleIcon,
    title: 'Receba a confirmação imediata',
    description: 'O sistema envia notificações para você e para o profissional, garantindo que o horário fique reservado.'
  }
]

const serviceCards = [
  {
    title: 'Banho completo',
    description: 'Limpeza e hidratação com produtos hipoalergênicos, ideal para manter o pet saudável e cheiroso.'
  },
  {
    title: 'Tosa higiênica',
    description: 'Corte e acabamento cuidadoso, respeitando as necessidades do animal e as preferências do tutor.'
  },
  {
    title: 'Banho + tosa',
    description: 'Atendimento completo em uma única visita, com acompanhamento do profissional responsável.'
  }
]

const managementHighlights = [
  'Acompanhe todos os agendamentos confirmados em tempo real.',
  'Visualize dados do tutor e do animal antes de cada atendimento.',
  'Registre observações ao concluir o serviço e mantenha o histórico sempre atualizado.'
]

export default function LandingPage () {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [pendingSchedule, setPendingSchedule] = useState(null)

  const defaultPath = useMemo(() => getDefaultPath(user?.role), [user?.role])

  const navigateWithPrefill = (path, prefill) => {
    if (prefill) {
      setPendingSchedule(null)
      navigate('/app/agendar', { state: { prefill } })
    } else {
      navigate(path || defaultPath)
    }
  }

  const handleLoginSuccess = ({ defaultPath: path }) => {
    setLoginOpen(false)
    navigateWithPrefill(path, pendingSchedule)
  }

  const handleRegisterSuccess = ({ defaultPath: path }) => {
    setRegisterOpen(false)
    navigateWithPrefill(path, pendingSchedule)
  }

  const handleRequireAuth = prefill => {
    if (prefill) {
      setPendingSchedule(prefill)
    }
    setLoginOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-neutral-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(40% 60% at -10% -10%, rgba(124, 109, 255, 0.35), transparent 55%), radial-gradient(55% 65% at 120% 10%, rgba(46, 54, 126, 0.55), transparent 60%)',
          backgroundColor: '#050611'
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-[32px] border border-neutral-600/40 bg-surface-200/70 px-6 py-4 shadow-card backdrop-blur">
            <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500 text-lg font-bold text-white shadow-elevated">
                BT
              </span>
              Banho &amp; Tosa
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-neutral-400 lg:flex">
              <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
              <a href="#servicos" className="transition hover:text-white">Serviços</a>
              <a href="#gestao" className="transition hover:text-white">Para o profissional</a>
            </nav>
            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <Button variant="ghost" onClick={() => setLoginOpen(true)} className="hidden lg:inline-flex">
                  Entrar
                </Button>
              )}
              <Button
                onClick={() => (isAuthenticated ? navigate(defaultPath) : setRegisterOpen(true))}
                className="rounded-full px-5"
              >
                {isAuthenticated ? 'Acessar agenda' : 'Criar conta'}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <section className="grid gap-10 rounded-[40px] border border-neutral-600/40 bg-surface-200/70 p-10 shadow-elevated backdrop-blur lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                Atendimento agendado com confiança
              </span>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                Banho e tosa com agendamento online simples
              </h1>
              <p className="text-base text-neutral-200 sm:text-lg">
                Organize os cuidados do seu pet pelo site: cadastre os animais, escolha o serviço desejado, confirme o melhor horário e receba atualizações do profissional responsável.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => (isAuthenticated ? navigate('/app/agendar') : setRegisterOpen(true))}>
                  Agendar agora
                </Button>
                {!isAuthenticated && (
                  <Button variant="secondary" onClick={() => setLoginOpen(true)}>
                    Já tenho conta
                  </Button>
                )}
              </div>
            </div>
            <LandingScheduleWidget isAuthenticated={isAuthenticated} onRequireAuth={handleRequireAuth} />
          </section>

          <section id="como-funciona" className="mt-20 space-y-10">
            <header className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-white">Como funciona</h2>
              <p className="mx-auto max-w-2xl text-sm text-neutral-300">
                O processo completo de agendamento foi pensado para conectar tutores e profissional responsável em poucos passos.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {stepItems.map(step => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-neutral-600/30 bg-surface-100/70 p-6 text-left shadow-card"
                >
                  <step.icon className="h-10 w-10 text-accent-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="servicos" className="mt-20 space-y-8">
            <header className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold text-white">Serviços disponíveis</h2>
              <p className="mx-auto max-w-2xl text-sm text-neutral-300">
                Escolha entre banho, tosa ou o combo completo. Todos os pedidos ficam registrados para futuras consultas.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {serviceCards.map(service => (
                <div key={service.title} className="rounded-3xl border border-neutral-600/30 bg-surface-100/70 p-6 shadow-card">
                  <CalendarDaysIcon className="h-8 w-8 text-accent-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="gestao" className="mt-20 grid gap-10 lg:grid-cols-[1fr,1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                Rotina do profissional
              </span>
              <h2 className="text-3xl font-semibold text-white">Agenda centralizada</h2>
              <p className="text-sm text-neutral-300">
                O profissional responsável acessa todos os horários reservados, acompanha dados do tutor e registra observações logo após a finalização do atendimento.
              </p>
              <ul className="space-y-3 text-sm text-neutral-200">
                {managementHighlights.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-1 h-5 w-5 text-accent-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] border border-neutral-600/40 bg-surface-200/70 p-8 shadow-card">
              <div className="flex items-center gap-3 text-sm font-semibold text-white">
                <ClipboardDocumentListIcon className="h-7 w-7 text-accent-400" />
                Painel do dia
              </div>
              <p className="mt-4 text-sm text-neutral-300">
                Visualize os serviços agendados por ordem de horário, confirme presenças, registre observações e marque o atendimento como concluído para manter o histórico sempre organizado.
              </p>
              <div className="mt-6 rounded-3xl border border-neutral-600/30 bg-surface-100/60 p-6 text-sm text-neutral-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400">Próximo atendimento</p>
                    <p className="text-lg font-semibold text-white">14:00 · Banho + tosa</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-accent-400" />
                </div>
                <div className="mt-4 space-y-2 text-xs text-neutral-300">
                  <p>Tutor: Ana Oliveira</p>
                  <p>Pet: Thor (porte médio)</p>
                  <p>Observações: Sensível a barulhos altos.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-neutral-700/60 bg-surface-200/60 py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-neutral-400 sm:flex-row sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Espaço Banho &amp; Tosa. Cuidado dedicado para cada pet.</p>
            <p className="flex items-center gap-2 text-neutral-300">
              <CheckCircleIcon className="h-5 w-5 text-accent-400" />
              Agendamentos confirmados automaticamente.
            </p>
          </div>
        </footer>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSuccess={handleRegisterSuccess} />
    </div>
  )
}

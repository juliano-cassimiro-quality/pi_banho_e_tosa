import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import ChatbotWidget from '../components/ChatbotWidget'
import LandingScheduleWidget from '../components/LandingScheduleWidget'
import useAuth from '../hooks/useAuth'
import { getDefaultPath } from '../utils/navigation'
import Button from '../components/Button'

const heroStats = [
  { label: 'Pets atendidos', value: '12 mil+' },
  { label: 'Avaliação média', value: '4,9/5' },
  { label: 'Profissionais certificados', value: '18 especialistas' }
]

const valueProps = [
  {
    icon: CalendarDaysIcon,
    title: 'Agenda integrada',
    description:
      'Disponibilidade em tempo real, confirmações automáticas e lembretes personalizados para cada tutor.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Segurança reforçada',
    description:
      'Profissionais certificados, protocolos de adaptação e monitoramento ao vivo em cada atendimento.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Concierge inteligente',
    description:
      'A Luma agenda, confirma e ajusta horários pelo chat 24/7 com histórico compartilhado com a equipe.'
  },
  {
    icon: UserGroupIcon,
    title: 'Experiência para tutores',
    description:
      'Painel completo para acompanhar serviços, planos, pets cadastrados e benefícios exclusivos.'
  }
]

const serviceCards = [
  {
    title: 'Banho relaxante',
    description: 'Ozonioterapia, hidratação profunda e perfume hipoalergênico para conforto máximo.',
    price: 'a partir de R$ 69',
    duration: '50 minutos',
    badge: 'Preferido',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Tosa personalizada',
    description: 'Tesoura artística, máquina ou stripping com consultoria de estilo por raça.',
    price: 'a partir de R$ 89',
    duration: '70 minutos',
    badge: 'Premium',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Day care & spa',
    description: 'Rotina de enriquecimento ambiental, recreação monitorada e relatórios em tempo real.',
    price: 'a partir de R$ 120',
    duration: 'Meio período ou integral',
    badge: 'Novidade',
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'
  }
]

const testimonials = [
  {
    name: 'Mariana Costa',
    role: 'Tutora da Mel (Spitz)',
    quote:
      '“Ver os bastidores em tempo real, receber fotos e relatórios no app me deixa tranquila. A Mel volta sempre leve e feliz.”'
  },
  {
    name: 'Eduardo Lima',
    role: 'Tutor do Simba (Golden)',
    quote:
      '“Consigo cuidar da rotina do Simba, reagendar pelo chat e acompanhar os pacotes no painel. Atendimento impecável.”'
  },
  {
    name: 'Larissa Gomes',
    role: 'Administradora da unidade Centro',
    quote:
      '“O dashboard mostra ocupação, ticket médio e recorrência em tempo real. Facilitou muito a gestão do time.”'
  }
]

const adminHighlights = [
  'Dashboard com ocupação diária, receita e recorrência.',
  'Gestão completa de clientes, pets, serviços e profissionais.',
  'Workflow omnichannel com disparos automáticos e chat unificado.'
]

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
    alt: 'Profissional secando cachorro pequeno com toalha.',
    caption: 'Equipe certificada em bem-estar animal e primeiros socorros.'
  },
  {
    src: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=800&q=80',
    alt: 'Dois cães brincando em área com brinquedos coloridos.',
    caption: 'Recreação monitorada em ambiente enriquecido e climatizado.'
  },
  {
    src: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
    alt: 'Profissional com tablet mostrando agenda para cliente.',
    caption: 'Tecnologia para acompanhar cada etapa do atendimento.'
  }
]

export default function LandingPage () {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [chatSignal, setChatSignal] = useState(0)
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

  const handleOpenChat = () => {
    setChatSignal(signal => signal + 1)
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
              Banho &amp; Tosa Signature
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-neutral-400 lg:flex">
              <a href="#servicos" className="transition hover:text-white">Serviços</a>
              <a href="#experiencia" className="transition hover:text-white">Experiência</a>
              <a href="#depoimentos" className="transition hover:text-white">Depoimentos</a>
              <a href="#admin" className="transition hover:text-white">Admin</a>
            </nav>
            <div className="flex items-center gap-3">
              {!isAuthenticated && (
                <Button variant="ghost" onClick={() => setLoginOpen(true)} className="hidden lg:inline-flex">
                  Entrar
                </Button>
              )}
              <Button onClick={() => (isAuthenticated ? navigate(defaultPath) : setRegisterOpen(true))}>
                {isAuthenticated ? 'Ir para minha área' : 'Criar conta' }
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
          <section className="grid gap-10 lg:grid-cols-[1.05fr,1fr]" id="hero">
            <div className="flex flex-col justify-center gap-8">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">
                  Banho &amp; Tosa de alta performance
                </span>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Uma experiência completa para pets, tutores e administradores.
                </h1>
                <p className="max-w-xl text-lg text-neutral-300">
                  Agende em segundos, acompanhe pelo chat inteligente da Luma e use o mesmo ambiente premium da landing em toda a jornada.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => (isAuthenticated ? navigate('/app/agendar') : setLoginOpen(true))}>
                    {isAuthenticated ? 'Agendar agora' : 'Entrar para agendar'}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" onClick={handleOpenChat}>
                    Conversar com a Luma
                    <SparklesIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <dl className="grid gap-4 sm:grid-cols-3">
                {heroStats.map(stat => (
                  <div key={stat.label} className="rounded-3xl border border-neutral-600/40 bg-surface-200/70 p-5 shadow-card">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{stat.label}</dt>
                    <dd className="mt-2 text-2xl font-semibold text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <LandingScheduleWidget
              isAuthenticated={isAuthenticated}
              user={user}
              onRequireAuth={handleRequireAuth}
            />
          </section>

          <section id="servicos" className="mt-24 space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">Serviços assinatura</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Tudo o que o seu pet precisa em um só lugar</h2>
                <p className="mt-2 max-w-2xl text-sm text-neutral-400">
                  Protocolos personalizados, acompanhamento fotográfico e concierge para tutores exigentes.
                </p>
              </div>
              <Button variant="ghost" onClick={() => (isAuthenticated ? navigate('/app/agendamentos') : setLoginOpen(true))}>
                Ver agenda completa
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {serviceCards.map(card => (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-600/40 bg-surface-200/80 shadow-elevated"
                >
                  <div
                    className="absolute inset-0 opacity-60 transition group-hover:opacity-80"
                    style={{ backgroundImage: `url(${card.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-ink-900/85 via-ink-900/40 to-ink-900/95 p-6">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-200">
                        {card.badge}
                      </span>
                      <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                      <p className="text-sm text-neutral-300">{card.description}</p>
                    </div>
                    <div className="mt-6 space-y-1 text-sm text-neutral-300">
                      <p className="font-medium text-accent-300">{card.price}</p>
                      <p>{card.duration}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experiencia" className="mt-24 space-y-10">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">Experiência premium</p>
              <h2 className="text-3xl font-semibold text-white">Tecnologia, cuidado e transparência do começo ao fim</h2>
              <p className="max-w-3xl text-sm text-neutral-400">
                Do primeiro contato ao pós-atendimento, você conta com alertas inteligentes, protocolos seguros e comunicação centralizada com toda a equipe.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {valueProps.map(feature => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-4 rounded-3xl border border-neutral-600/40 bg-surface-200/70 p-6 shadow-card"
                >
                  <feature.icon className="h-8 w-8 text-accent-400" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-neutral-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="depoimentos" className="mt-24 space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">Depoimentos reais</p>
              <h2 className="text-3xl font-semibold text-white">Quem vive a experiência conta como é</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map(testimonial => (
                <blockquote
                  key={testimonial.name}
                  className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-neutral-600/40 bg-surface-200/70 p-6 shadow-card"
                >
                  <p className="text-sm text-neutral-300">{testimonial.quote}</p>
                  <footer className="space-y-1 text-sm">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-neutral-400">{testimonial.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section className="mt-24 grid gap-6 lg:grid-cols-3" id="galeria">
            {gallery.map(item => (
              <figure key={item.alt} className="overflow-hidden rounded-3xl border border-neutral-600/40 bg-surface-200/70 shadow-card">
                <img src={item.src} alt={item.alt} className="h-56 w-full object-cover" />
                <figcaption className="p-4 text-sm text-neutral-300">{item.caption}</figcaption>
              </figure>
            ))}
          </section>

          <section id="admin" className="mt-24 grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">
                Painel administrativo
              </span>
              <h2 className="text-3xl font-semibold text-white">Dashboard completo para o time admin</h2>
              <p className="max-w-2xl text-sm text-neutral-400">
                Monitore a performance da unidade em tempo real, gerencie profissionais, pets, serviços e organize o fluxo de atendimento em um único lugar.
              </p>
              <ul className="space-y-3 text-sm text-neutral-300">
                {adminHighlights.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-1 h-5 w-5 text-accent-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => (isAuthenticated ? navigate('/app/dashboard') : setLoginOpen(true))}>
                  Acessar dashboard
                </Button>
                <Button variant="ghost" onClick={() => setRegisterOpen(true)}>
                  Cadastrar meu time
                </Button>
              </div>
            </div>
            <div className="rounded-[32px] border border-neutral-600/40 bg-surface-200/70 p-6 shadow-elevated">
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span className="inline-flex items-center gap-2 text-accent-300">
                  <CheckBadgeIcon className="h-5 w-5" />
                  Indicadores ao vivo
                </span>
                <span>Atualizado agora</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-neutral-600/40 bg-surface-300/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ocupação de hoje</p>
                  <p className="mt-2 text-3xl font-semibold text-white">82%</p>
                  <p className="mt-1 text-xs text-neutral-400">+12% vs semana passada</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-600/40 bg-surface-300/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ticket médio</p>
                    <p className="mt-2 text-2xl font-semibold text-white">R$ 184</p>
                    <p className="mt-1 text-xs text-neutral-400">Projetado até o final do mês</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-600/40 bg-surface-300/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Recorrência</p>
                    <p className="mt-2 text-2xl font-semibold text-white">73%</p>
                    <p className="mt-1 text-xs text-neutral-400">Clientes ativos nos últimos 90 dias</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-600/40 bg-surface-300/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Próximos atendimentos</p>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-accent-400" /> Belinha • Tosa</span>
                      <span>14:00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><ChatBubbleLeftRightIcon className="h-4 w-4 text-accent-400" /> Thor • Banho e hidratação</span>
                      <span>15:30</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><CalendarDaysIcon className="h-4 w-4 text-accent-400" /> Nala • Day care</span>
                      <span>17:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24 overflow-hidden rounded-[32px] border border-neutral-600/40 bg-gradient-to-r from-surface-300 via-surface-200 to-ink-900 p-10 shadow-elevated">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">Pronto para começar?</p>
                <h2 className="text-3xl font-semibold text-white">Transforme a rotina do seu pet com a nossa experiência premium.</h2>
                <p className="max-w-xl text-sm text-neutral-300">
                  Fale com a Luma, crie sua conta e comece a agendar em minutos. Tudo isso sem sair desta página.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => (isAuthenticated ? navigate(defaultPath) : setRegisterOpen(true))}>
                  Criar conta gratuita
                </Button>
                <Button variant="secondary" onClick={handleOpenChat}>
                  Agendar pelo chat
                </Button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-neutral-700/60 bg-surface-200/60 py-8 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} Banho &amp; Tosa Signature. Cuidado completo em cada detalhe.</p>
            <p className="flex items-center gap-2 text-neutral-300">
              <SparklesIcon className="h-4 w-4 text-accent-400" /> Luma online 24/7 para orientar você.
            </p>
          </div>
        </footer>
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenRegister={() => setRegisterOpen(true)}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
        onOpenLogin={() => setLoginOpen(true)}
      />
      <ChatbotWidget openSignal={chatSignal} />
    </div>
  )
}

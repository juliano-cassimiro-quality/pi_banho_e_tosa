import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import ChatbotWidget from '../components/ChatbotWidget'
import LandingScheduleWidget from '../components/LandingScheduleWidget'
import useAuth from '../hooks/useAuth'

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
    icon: HeartIcon,
    title: 'Experiência acolhedora',
    description:
      'Ambiente climatizado, produtos hipoalergênicos e protocolos de adaptação para filhotes e pets idosos.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Segurança reforçada',
    description:
      'Profissionais certificados, checklist de saúde e registro fotográfico de cada etapa do atendimento.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Luma, sua concierge',
    description:
      'Agende, reagende e receba recomendações pelo chat inteligente disponível 24 horas.'
  }
]

const serviceCards = [
  {
    title: 'Banho relaxante',
    description: 'Banho com ozonioterapia, escovação dental e hidratação das patinhas.',
    price: 'a partir de R$ 69',
    duration: '50 minutos',
    badge: 'Preferido',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Tosa personalizada',
    description: 'Tesoura artística, máquina ou stripping com consultoria de estilo para cada raça.',
    price: 'a partir de R$ 89',
    duration: '70 minutos',
    badge: 'Premium',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Day care & spa',
    description: 'Diária com recreação monitorada, enriquecimento ambiental e relatórios em tempo real.',
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
      '“Acompanhar o banho em vídeo e receber o checklist com fotos deixa tudo mais transparente. A Mel sempre volta cheirosa e tranquila.”'
  },
  {
    name: 'Eduardo Lima',
    role: 'Tutor do Simba (Golden)',
    quote:
      '“Consigo organizar os banhos do Simba e os retornos do veterinário pelo mesmo painel. A equipe de tosa é impecável e super paciente.”'
  },
  {
    name: 'Larissa Gomes',
    role: 'Administradora da unidade Centro',
    quote:
      '“O dashboard mostra a ocupação das agendas, ticket médio e recorrência em tempo real. Facilitou muito a gestão da equipe.”'
  }
]

const adminHighlights = [
  'Dashboard com ocupação diária, receita e indicadores de recorrência.',
  'Gestão de clientes, pets, profissionais e serviços em um só lugar.',
  'Central de comunicação com disparo de lembretes e campanhas segmentadas.'
]

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
    alt: 'Profissional secando cachorro pequeno com toalha.',
    caption: 'Equipe treinada e certificada em bem-estar animal.'
  },
  {
    src: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&w=800&q=80',
    alt: 'Dois cães brincando em área com brinquedos coloridos.',
    caption: 'Recreação monitorada e espaço lúdico com supervisão constante.'
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

  const defaultPath = useMemo(
    () => (user?.role === 'profissional' ? '/app/gestao' : '/app/agendamentos'),
    [user?.role]
  )

  const navigateWithPrefill = (path, prefill) => {
    if (prefill) {
      const nextPrefill = prefill
      setPendingSchedule(null)
      navigate('/app/agendar', { state: { prefill: nextPrefill } })
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
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-primary-50" aria-hidden="true" />
      <div className="absolute -left-24 top-16 -z-10 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 top-40 -z-10 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" aria-hidden="true" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-primary-800">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">BT</span>
          Banho &amp; Tosa Premium
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#servicos" className="transition hover:text-primary-700">
            Serviços
          </a>
          <a href="#estrutura" className="transition hover:text-primary-700">
            Estrutura
          </a>
          <a href="#depoimentos" className="transition hover:text-primary-700">
            Depoimentos
          </a>
          <a href="#contato" className="transition hover:text-primary-700">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-3 text-sm font-semibold">
          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="hidden rounded-full px-5 py-2 text-primary-700 transition hover:bg-primary-100 md:inline-flex"
            >
              Entrar
            </button>
          )}
          {isAuthenticated ? (
            <Link
              to={defaultPath}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-white shadow-lg transition hover:bg-brand-600"
            >
              Ir para o painel
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-white shadow-lg transition hover:bg-brand-600"
            >
              Criar conta gratuita
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-28 px-6 pb-28">
        <section className="grid gap-12 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-600 shadow-sm">
              Agenda o seu banho &amp; tosa
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Cuidados completos, transparência digital e carinho em cada atendimento.
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              Faça tudo em um só lugar: cadastre pets, confirme horários, acompanhe em tempo real e receba recomendações da Luma. Disponível para tutores e administradores.
            </p>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link
                  to={defaultPath}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
                >
                  Acessar minha agenda
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
                  >
                    Entrar na agenda
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    Criar conta gratuita
                    <SparklesIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={handleOpenChat}
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
              >
                Agendar com a Luma
              </button>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {heroStats.map(item => (
                <div key={item.label} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-500">{item.label}</dt>
                  <dd className="mt-2 text-xl font-semibold text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 opacity-90" aria-hidden="true" />
            <div className="overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"
                alt="Dois cachorros felizes após o banho."
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 left-1/2 w-64 -translate-x-1/2 rounded-3xl border border-white/70 bg-white p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">Check-in digital</p>
                  <p className="text-sm text-slate-600">Histórico completo, fotos e observações sempre à mão.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingScheduleWidget
          isAuthenticated={isAuthenticated}
          user={user}
          onRequireAuth={handleRequireAuth}
          onShowChat={handleOpenChat}
        />

        <section id="estrutura" className="space-y-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Cuidados com muito carinho</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Tecnologia e afeto em cada detalhe</h2>
            <p className="mt-4 text-base text-slate-600">
              Conheça a infraestrutura que garante segurança, conforto e comunicação transparente entre equipe e tutores.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map(feature => (
              <div key={feature.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="servicos" className="space-y-10">
          <div className="flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Principais serviços</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Planos sob medida para cada pet</h2>
              <p className="mt-3 max-w-xl text-base text-slate-600">
                Combine banho, tosa, spa e hotelzinho com pacotes recorrentes ou avulsos. Tudo pode ser agendado em poucos cliques ou com ajuda da Luma.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenChat}
              className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-400 hover:text-primary-900"
            >
              Conversar sobre pacotes
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {serviceCards.map(card => (
              <article key={card.title} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {card.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                  </div>
                  <div className="mt-auto space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2 text-slate-600">
                      <CheckCircleIcon className="h-4 w-4 text-brand-500" />
                      Duração média: {card.duration}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <SparklesIcon className="h-4 w-4 text-brand-500" />
                      {card.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Agendar com a Luma
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="depoimentos" className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Depoimentos de clientes</p>
            <h2 className="text-3xl font-bold text-slate-900">Resultados percebidos em tutores e gestores</h2>
            <p className="text-base text-slate-600">
              Transparência total: enquanto os tutores acompanham cada etapa, a equipe administrativa controla a agenda, o faturamento e o desempenho dos profissionais em tempo real.
            </p>
            <ul className="space-y-4">
              {adminHighlights.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckBadgeIcon className="mt-1 h-5 w-5 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dashboard administrativo completo</p>
                  <p className="text-xs text-slate-500">Clientes, pets, profissionais, serviços, relatórios e agenda sincronizada.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            {testimonials.map(testimonial => (
              <figure key={testimonial.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <blockquote className="text-base text-slate-600">{testimonial.quote}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</figcaption>
                <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
              </figure>
            ))}
          </div>
        </section>

        <section id="galeria" className="space-y-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Galeria</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Momentos felizes no nosso espaço</h2>
            <p className="mt-3 text-base text-slate-600">
              Veja como nossa equipe recebe os pets com carinho, tecnologia e segurança em cada atendimento.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {gallery.map(item => (
              <figure key={item.src} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                <div className="h-56 overflow-hidden">
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <figcaption className="p-5 text-sm text-slate-600">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-brand-500 via-brand-500 to-primary-600 px-10 py-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" aria-hidden="true" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[2fr,1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Pronto para fazer parte da experiência Banho &amp; Tosa Premium?</h2>
              <p className="mt-4 text-base text-brand-50">
                Cadastre sua conta gratuita, convide a equipe e comece a encantar tutores com uma gestão inteligente.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              {isAuthenticated ? (
                <Link
                  to={defaultPath}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-lg transition hover:bg-brand-100"
                >
                  Ir para o painel
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setRegisterOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 shadow-lg transition hover:bg-brand-100"
                >
                  Criar conta gratuita
                </button>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col items-center gap-1 text-sm">
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="text-sm underline decoration-white/60 decoration-dashed underline-offset-4"
                  >
                    Já sou cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    className="text-sm underline decoration-white/60 decoration-dashed underline-offset-4"
                  >
                    Quero ser parceiro
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer id="contato" className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-slate-900">Banho &amp; Tosa Premium</p>
            <p className="text-sm text-slate-500">
              Rua dos Pets, 123 - Centro, São Paulo/SP<br />
              Atendimento de segunda a sábado, das 8h às 20h.
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Contato</p>
            <p>Telefone: (11) 1234-5678</p>
            <p>
              E-mail: <a href="mailto:contato@banhoetosa.com" className="text-primary-600">contato@banhoetosa.com</a>
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Para administradores</p>
            <p>Dashboard financeiro, CRM de clientes, controle de equipe e relatórios exportáveis.</p>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="text-sm font-semibold text-primary-600 underline-offset-4 hover:underline"
                >
                  Acessar área administrativa
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterOpen(true)}
                  className="text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                  Criar conta da unidade
                </button>
              </div>
            )}
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Faça parte da nossa comunidade</p>
            <p>Receba dicas de cuidados, promoções e conteúdos exclusivos para tutores e profissionais.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                Assinar
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Banho &amp; Tosa Premium. Todos os direitos reservados.
        </div>
      </footer>

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
      <ChatbotWidget initialOpen={false} openSignal={chatSignal} />
    </div>
  )
}

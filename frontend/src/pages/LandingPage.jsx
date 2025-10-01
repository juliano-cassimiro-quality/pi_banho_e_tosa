import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import ChatbotWidget from '../components/ChatbotWidget'
import useAuth from '../hooks/useAuth'

const features = [
  {
    name: 'Agenda inteligente',
    description: 'Escolha serviços, profissionais e horários disponíveis em poucos cliques, com confirmação automática.',
    icon: CalendarDaysIcon
  },
  {
    name: 'Atendimento personalizado',
    description: 'Cadastro completo dos pets, histórico de cuidados e observações para experiências mais seguras.',
    icon: ShieldCheckIcon
  },
  {
    name: 'Chatbot sempre online',
    description: 'Receba suporte imediato com a Luma para dúvidas sobre serviços, horários e agendamentos.',
    icon: ChatBubbleLeftRightIcon
  }
]

const steps = [
  {
    title: '1. Crie sua conta',
    description: 'Cadastre seus dados e dos seus pets em minutos.'
  },
  {
    title: '2. Escolha o serviço',
    description: 'Compare opções de banho, tosa, hidratação e cuidados especiais.'
  },
  {
    title: '3. Confirme o melhor horário',
    description: 'Veja horários livres em tempo real e receba notificações automáticas.'
  }
]

const faqs = [
  {
    question: 'Quais serviços estão disponíveis?',
    answer: 'Oferecemos banho, tosa higiênica, tosa completa, hidratação, desembolo e pacotes especiais para diferentes portes. Confira detalhes e valores direto no painel ou converse com a Luma.'
  },
  {
    question: 'Posso reagendar ou cancelar?',
    answer: 'Sim. Pelo painel de agendamentos você pode reagendar ou cancelar com até 2 horas de antecedência. Também enviamos confirmações e lembretes automáticos.'
  },
  {
    question: 'O atendimento presencial é onde?',
    answer: 'Nossa loja fica na Rua dos Pets, 123, Centro de São Paulo/SP. Temos estacionamento conveniado ao lado da unidade.'
  }
]

export default function LandingPage () {
  const { isAuthenticated, user } = useAuth()
  const defaultPath = user?.role === 'profissional' ? '/app/gestao' : '/app/agendamentos'

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(47,109,255,0.12),_transparent_55%)]" aria-hidden="true" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-lg font-semibold text-primary-700">
          Banho &amp; Tosa
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          {!isAuthenticated && (
            <Link to="/login" className="rounded-full px-4 py-2 transition hover:bg-primary-100 hover:text-primary-700">
              Entrar
            </Link>
          )}
          <Link to={isAuthenticated ? defaultPath : '/cadastro'} className="rounded-full bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700">
            {isAuthenticated ? 'Ir para o painel' : 'Criar conta'}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 pb-24">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              Banho &amp; tosa com experiência premium
            </span>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Agendamentos descomplicados e cuidados que seu pet merece
            </h1>
            <p className="text-lg text-slate-600">
              Organize banhos, tosas e tratamentos especiais em um painel intuitivo. Nossa equipe especialista cuida do seu pet e nossa assistente virtual acompanha cada etapa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={isAuthenticated ? defaultPath : '/cadastro'} className="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700">
                Começar agora
              </Link>
              <Link to={isAuthenticated ? defaultPath : '/login'} className="inline-flex items-center rounded-full border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-50">
                Ver agendamentos
              </Link>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-slate-500">Tempo médio de agendamento</dt>
                <dd className="text-2xl font-semibold text-slate-900">3 minutos</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Profissionais certificados</dt>
                <dd className="text-2xl font-semibold text-slate-900">+15 groomers</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Avaliação dos clientes</dt>
                <dd className="text-2xl font-semibold text-slate-900">4,9/5</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-3xl bg-primary-100 opacity-60 blur-3xl" aria-hidden="true" />
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur">
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Resumo do pet</h3>
                  <p className="mt-2 text-sm text-slate-500">Histórico de serviços, observações e alertas personalizados para cada atendimento.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Próximo agendamento</h3>
                  <p className="mt-2 text-sm text-slate-500">Escolha data, horário e profissional preferido em tempo real.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-slate-900">Assistente virtual</h3>
                  <p className="mt-2 text-sm text-slate-500">A Luma responde dúvidas sobre serviços, horários e envia lembretes inteligentes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Por que escolher a Banho &amp; Tosa</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Tecnologia e carinho para o seu pet</h2>
            <p className="mt-4 text-base text-slate-600">Nossos processos foram pensados para simplificar o dia a dia, oferecer transparência e deixar você sempre informado.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(feature => (
              <div key={feature.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Como funciona</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Agendamento em três etapas rápidas</h2>
            <p className="mt-4 text-base text-slate-600">Com poucos cliques você confirma o próximo banho ou tosa. Nossa equipe recebe notificações automáticas e prepara tudo para o atendimento.</p>
          </div>
          <ol className="space-y-6">
            {steps.map(step => (
              <li key={step.title} className="flex items-start gap-4">
                <SparklesIcon className="mt-1 h-6 w-6 text-primary-500" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Depoimento</p>
            <blockquote className="mt-4 space-y-4">
              <p className="text-lg text-slate-600">“Consigo agendar o banho da Mel em segundos e o histórico com observações ajuda muito nas tosas. A equipe é super carinhosa e a Luma tira todas as dúvidas.”</p>
              <footer className="text-sm font-semibold text-slate-900">Mariana Costa, tutora da Mel</footer>
            </blockquote>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Perguntas frequentes</p>
            <div className="mt-4 space-y-4">
              {faqs.map(item => (
                <details key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-primary-600 px-8 py-12 text-white">
          <div className="absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" aria-hidden="true" />
          <div className="relative z-10 grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Pronto para transformar o banho e tosa do seu pet?</h2>
              <p className="mt-4 text-base text-primary-50">Cadastre-se gratuitamente e comece a organizar seus agendamentos com suporte inteligente.</p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <Link
                to={isAuthenticated ? defaultPath : '/cadastro'}
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-lg transition hover:bg-primary-100 md:w-auto"
              >
                {isAuthenticated ? 'Acessar painel' : 'Criar conta gratuita'}
              </Link>
              <Link to="/login" className="text-sm underline decoration-primary-200 decoration-dashed underline-offset-4">
                Já sou cliente
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ChatbotWidget initialOpen={false} />
    </div>
  )
}

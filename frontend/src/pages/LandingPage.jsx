import React from 'react'
import { Link } from 'react-router-dom'
import {
  CameraIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    title: 'Banho relaxante',
    description:
      'Espumas suaves, água na temperatura ideal e produtos hipoalergênicos para um momento de bem-estar completo.',
    icon: SparklesIcon
  },
  {
    title: 'Tosa com estilo',
    description:
      'Cortes clássicos ou personalizados, sempre respeitando a raça, o formato do corpo e a personalidade do pet.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Spa pet completo',
    description:
      'Hidratação profunda, limpeza das orelhas e cuidados com as patinhas para um visual impecável.',
    icon: HeartIcon
  }
]

const highlights = [
  {
    title: 'Equipe apaixonada',
    description:
      'Profissionais experientes, formados em comportamento animal, atentos a cada sinal de conforto do seu melhor amigo.'
  },
  {
    title: 'Ambiente tranquilo',
    description:
      'Estrutura climatizada, música relaxante e aromas delicados criam um refúgio seguro e acolhedor para o pet.'
  },
  {
    title: 'Segurança em primeiro lugar',
    description:
      'Protocolos de higiene e monitoramento constante garantem um atendimento livre de estresse do início ao fim.'
  }
]

const testimonials = [
  {
    quote:
      'O atendimento é extremamente acolhedor. Minha cadela Nina sempre volta perfumada e tranquila, sem nenhum sinal de ansiedade.',
    author: 'Fernanda Vieira',
    pet: 'tutora da Nina, shih-tzu'
  },
  {
    quote:
      'Eles entenderam perfeitamente as necessidades do Thor. A tosa ficou impecável e ainda ganhamos dicas de cuidados diários!',
    author: 'Rafael Martins',
    pet: 'tutor do Thor, spitz alemão'
  },
  {
    quote:
      'A equipe é muito atenciosa. O banho terapêutico fez toda a diferença para a pele sensível da Amora.',
    author: 'Luiza Carvalho',
    pet: 'tutora da Amora, poodle'
  }
]

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=900&q=80',
    alt: 'Cachorro de pequeno porte recebendo carinho após o banho.'
  },
  {
    src: 'https://images.unsplash.com/photo-1615751072497-5f5169febe51?auto=format&fit=crop&w=900&q=80',
    alt: 'Gato sendo escovado em ambiente iluminado por tons de azul.'
  },
  {
    src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    alt: 'Profissional secando um cachorro com toalha macia após o banho.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    alt: 'Dois filhotes de cachorro olhando para a câmera dentro da banheira.'
  }
]

export default function LandingPage () {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-slate-100 to-white text-slate-900 transition-colors dark:from-[#020617] dark:via-[#050b1b] dark:to-[#030617] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl dark:bg-blue-600/20" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200/60 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/60">
            <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg">
                BT
              </span>
              Espaço Banho &amp; Tosa
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 lg:flex">
              <a href="#servicos" className="transition hover:text-blue-600 dark:hover:text-blue-300">Serviços</a>
              <a href="#experiencia" className="transition hover:text-blue-600 dark:hover:text-blue-300">Experiência</a>
              <a href="#galeria" className="transition hover:text-blue-600 dark:hover:text-blue-300">Galeria</a>
              <a href="#depoimentos" className="transition hover:text-blue-600 dark:hover:text-blue-300">Depoimentos</a>
              <a href="#contato" className="transition hover:text-blue-600 dark:hover:text-blue-300">Contato</a>
            </nav>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900"
            >
              <PhoneIcon className="h-5 w-5" />
              Fale conosco
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <section className="grid gap-12 rounded-[40px] border border-slate-200/70 bg-white/80 p-10 shadow-2xl backdrop-blur-lg dark:border-slate-800/60 dark:bg-slate-900/60 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                Cuidado premium para pets felizes
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
                Banho e tosa clássicos com um toque de elegância
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Um espaço pensado para encantar tutores exigentes. Do banho relaxante à finalização impecável, cada etapa é conduzida com carinho, tecnologia e expertise para realçar a beleza natural do seu companheiro.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-slate-900"
                >
                  Conheça os cuidados
                </a>
                <a
                  href="#galeria"
                  className="inline-flex items-center justify-center rounded-full border border-blue-200/80 px-6 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-white dark:border-blue-500/40 dark:text-blue-200 dark:hover:border-blue-400 dark:hover:text-blue-100 dark:focus:ring-offset-slate-900"
                >
                  Veja nossa galeria
                </a>
              </div>
              <div className="mt-6 grid gap-4 rounded-3xl border border-blue-100/80 bg-blue-50/80 p-6 dark:border-blue-500/20 dark:bg-blue-950/30 sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-semibold text-blue-700 dark:text-blue-300">12+</p>
                  <p className="text-xs uppercase tracking-wide text-blue-800/80 dark:text-blue-200/70">anos de experiência</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-blue-700 dark:text-blue-300">1.200</p>
                  <p className="text-xs uppercase tracking-wide text-blue-800/80 dark:text-blue-200/70">pets atendidos por ano</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-blue-700 dark:text-blue-300">100%</p>
                  <p className="text-xs uppercase tracking-wide text-blue-800/80 dark:text-blue-200/70">avaliações positivas</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-slate-100/80 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/60">
              <img
                src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80"
                alt="Cachorro branco com lenço azul após banho e tosa."
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 text-slate-100">
                <p className="text-sm font-medium">Momentos de cuidado que viram memórias inesquecíveis.</p>
              </div>
            </div>
          </section>

          <section id="servicos" className="mt-20 space-y-10">
            <header className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Serviços sob medida</h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Nossos pacotes combinam técnicas clássicas com um toque moderno. Escolha a experiência perfeita para o perfil do seu pet e relaxe enquanto nossa equipe cuida de cada detalhe.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map(service => (
                <div
                  key={service.title}
                  className="h-full rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/60"
                >
                  <service.icon className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="experiencia" className="mt-20 grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
            <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-8 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/60">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                Nossa essência
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">Experiência que inspira confiança</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Cada visita é planejada para que o tutor acompanhe de perto todo o cuidado dedicado ao pet. Transparência, carinho e comunicação constante fazem parte da nossa rotina.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                {highlights.map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <StarIcon className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.map(image => (
                <figure
                  key={image.src}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-100/80 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/60"
                >
                  <img src={image.src} alt={image.alt} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                </figure>
              ))}
            </div>
          </section>

          <section id="galeria" className="mt-20 space-y-8">
            <header className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Galeria de momentos felizes</h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                O brilho no olhar dos pets fala por si só. Conheça um pouco da atmosfera encantadora que criamos em cada atendimento.
              </p>
            </header>
            <div className="grid gap-4 md:grid-cols-3">
              {galleryImages.map(image => (
                <figure
                  key={`${image.src}-gallery`}
                  className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-100/70 shadow-xl dark:border-slate-700/60 dark:bg-slate-800/60"
                >
                  <img src={image.src} alt={image.alt} className="h-56 w-full object-cover" />
                </figure>
              ))}
            </div>
          </section>

          <section id="depoimentos" className="mt-20 space-y-8">
            <header className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Depoimentos dos tutores</h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Histórias reais de clientes que confiam nos nossos cuidados para transformar o banho e tosa em uma experiência prazerosa.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map(testimonial => (
                <blockquote
                  key={testimonial.author}
                  className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl dark:border-slate-700/60 dark:bg-slate-900/60"
                >
                  <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  <p className="mt-4 flex-1 text-sm text-slate-600 dark:text-slate-300">“{testimonial.quote}”</p>
                  <footer className="mt-6 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-slate-500 dark:text-slate-400">{testimonial.pet}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section id="contato" className="mt-20 rounded-[32px] border border-slate-200/70 bg-white/80 p-10 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/60">
            <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Pronto para um dia de spa?</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Reserve um horário pelo telefone ou envie uma mensagem. Vamos preparar tudo para que o seu pet viva uma experiência inesquecível no Espaço Banho &amp; Tosa.
                </p>
                <div className="mt-6 grid gap-6 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="mt-1 h-6 w-6 text-blue-600 dark:text-blue-300" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Telefone</p>
                      <a href="tel:+5511999999999" className="mt-1 block text-blue-700 transition hover:text-blue-500 dark:text-blue-200 dark:hover:text-blue-100">
                        (11) 99999-9999
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="mt-1 h-6 w-6 text-blue-600 dark:text-blue-300" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Endereço</p>
                      <p className="mt-1 leading-relaxed">Alameda das Acácias, 120 - Jardim Azul, São Paulo - SP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="mt-1 h-6 w-6 text-blue-600 dark:text-blue-300" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Funcionamento</p>
                      <p className="mt-1 leading-relaxed">Ter a Sáb · 9h às 19h</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-blue-200/80 bg-blue-50/80 p-8 text-slate-700 shadow-xl dark:border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-100">
                <div className="flex items-center gap-3">
                  <CameraIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  <p className="text-lg font-semibold">Tour guiado</p>
                </div>
                <p className="mt-4 text-sm">
                  Visite nosso espaço e acompanhe cada detalhe do atendimento. Temos sala de espera confortável com bebidas e vista panorâmica para o ambiente de banho e tosa.
                </p>
                <p className="mt-4 text-xs uppercase tracking-widest text-blue-800/70 dark:text-blue-200/70">Experiência exclusiva para tutores exigentes</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200/70 bg-white/70 py-6 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/60">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-300">
            <p>© {new Date().getFullYear()} Espaço Banho &amp; Tosa. Amor, elegância e bem-estar para cada pet.</p>
            <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              Detalhes que fazem a diferença desde 2012.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

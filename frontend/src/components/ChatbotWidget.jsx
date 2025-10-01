import React, { useEffect, useRef, useState } from 'react'
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'
const KNOWLEDGE_BASE = [
  {
    match: ['serviço', 'servicos', 'banho', 'tosa'],
    response:
      'Oferecemos banho relaxante com hidratação, tosa higiênica e o combo banho + tosa. Todos incluem checagem rápida de saúde, produtos hipoalergênicos e notificações em tempo real.'
  },
  {
    match: ['preço', 'preço', 'valor', 'quanto'],
    response:
      'Os valores variam conforme o porte do pet: banho a partir de R$ 60, tosa a partir de R$ 85 e o combo completo a partir de R$ 130. Clientes frequentes contam com pacotes especiais.'
  },
  {
    match: ['pagamento', 'pagar', 'pix', 'cartão'],
    response:
      'Aceitamos cartões de crédito, débito, PIX e carteiras digitais. Também é possível deixar o pagamento salvo para agilizar os próximos agendamentos.'
  },
  {
    match: ['horário', 'funcionamento', 'agenda', 'disponibilidade'],
    response:
      'Atendemos de segunda a sábado, das 9h às 18h. Pelo botão de agendamento você confere, em tempo real, os horários livres do profissional responsável.'
  },
  {
    match: ['preparar', 'antes', 'orientação'],
    response:
      'Recomendamos alimentar o pet com no mínimo 2h de antecedência, trazer carteira de vacinação atualizada e informar alergias ou sensibilidades especiais durante o agendamento.'
  }
]

function simularResposta (pergunta) {
  const texto = pergunta.toLowerCase()
  const encontrado = KNOWLEDGE_BASE.find(item => item.match.some(chave => texto.includes(chave)))
  if (encontrado) {
    return Promise.resolve({ texto: encontrado.response, sugestoes: DEFAULT_SUGGESTIONS })
  }

  return Promise.resolve({
    texto:
      'Posso ajudar com detalhes sobre serviços, valores, horários e preparos para o atendimento. Deseja que eu abra a agenda para você escolher um horário?',
    sugestoes: DEFAULT_SUGGESTIONS
  })
}

const INITIAL_MESSAGE =
  'Olá! Eu sou a Luma, assistente virtual da Banho & Tosa Premium. Posso te contar sobre nossos serviços, preços, horários, promoções ou mesmo abrir a agenda para você. O que deseja saber primeiro?'
const DEFAULT_SUGGESTIONS = [
  'Quais serviços premium vocês oferecem?',
  'Quais são as formas de pagamento?',
  'Como preparar meu pet para o atendimento?',
  'Como faço para agendar?'
]

export default function ChatbotWidget ({ initialOpen = false, openSignal = 0 }) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [messages, setMessages] = useState([{ sender: 'bot', text: INITIAL_MESSAGE }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS)
  const endRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (openSignal > 0) {
      setIsOpen(true)
    }
  }, [openSignal])

  const sendMessage = async content => {
    if (loading) return
    const trimmed = content.trim()
    if (!trimmed) return

    setMessages(prev => [...prev, { sender: 'user', text: trimmed }])
    setInput('')
    setLoading(true)

    try {
      const resposta = await simularResposta(trimmed)
      setMessages(prev => [...prev, { sender: 'bot', text: resposta.texto }])
      if (Array.isArray(resposta.sugestoes) && resposta.sugestoes.length > 0) {
        setSuggestions(resposta.sugestoes)
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Desculpe, não consegui falar com nossa central agora. Tente novamente em instantes.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    sendMessage(input)
  }

  const handleSuggestion = suggestion => {
    sendMessage(suggestion)
  }

  const renderMessage = message => {
    const lines = message.text.split('\n')
    return lines.map((line, index) => (
      <React.Fragment key={`${index}-${line}`}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="flex w-80 flex-col overflow-hidden rounded-3xl border border-neutral-600/40 bg-surface-200/90 shadow-elevated backdrop-blur">
          <div className="flex items-center justify-between bg-accent-500/90 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Assistente Banho &amp; Tosa</p>
              <p className="text-xs opacity-85">Tempo médio de resposta em segundos</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-accent-600/80"
              aria-label="Fechar chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-surface-100/60 px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-card ${
                  message.sender === 'user'
                    ? 'self-end rounded-br-none bg-accent-500 text-white'
                    : 'self-start rounded-bl-none bg-surface-200/80 text-neutral-100'
                }`}
              >
                {renderMessage(message)}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-2xl rounded-bl-none bg-surface-200/80 px-3 py-2 text-sm text-neutral-300 shadow-card">
                Digitando...
              </div>
            )}
            <div ref={endRef} />
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-neutral-600/30 bg-surface-200/70 px-4 py-2">
              {suggestions.slice(0, 4).map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-full border border-accent-500/40 bg-transparent px-3 py-1 text-xs text-accent-300 transition hover:bg-accent-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-neutral-600/30 bg-surface-200/80 px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Digite sua mensagem"
              className="flex-1 rounded-full border border-neutral-600/40 bg-surface-100/60 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white transition hover:bg-accent-600 disabled:opacity-60"
              disabled={loading}
              aria-label="Enviar mensagem"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-elevated transition hover:bg-accent-600"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          Falar com a Luma
        </button>
      )}
    </div>
  )
}

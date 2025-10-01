import React, { useEffect, useRef, useState } from 'react'
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import api from '../services/api'

const INITIAL_MESSAGE = 'Olá! Eu sou a Luma, assistente virtual da Banho & Tosa. Como posso te ajudar hoje?'
const DEFAULT_SUGGESTIONS = [
  'Quais serviços vocês oferecem?',
  'Quais são os horários de funcionamento?',
  'Como faço para agendar?',
  'Posso cancelar um agendamento?'
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
      const { data } = await api.post('/chatbot', { message: trimmed })
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }])
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
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
        <div className="flex w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Assistente Banho &amp; Tosa</p>
              <p className="text-xs opacity-90">Tempo médio de resposta em segundos</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-primary-500"
              aria-label="Fechar chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                  message.sender === 'user'
                    ? 'self-end rounded-br-none bg-primary-600 text-white'
                    : 'self-start rounded-bl-none bg-white text-slate-700'
                }`}
              >
                {renderMessage(message)}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-2xl rounded-bl-none bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
                Digitando...
              </div>
            )}
            <div ref={endRef} />
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-200 px-4 py-2">
              {suggestions.slice(0, 3).map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-full border border-primary-200 px-3 py-1 text-xs text-primary-600 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Digite sua mensagem"
              className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              disabled={loading}
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-60"
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
          className="flex items-center gap-3 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-primary-700"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          Falar com a Luma
        </button>
      )}
    </div>
  )
}

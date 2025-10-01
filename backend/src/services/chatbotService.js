import { listarServicos } from './servicosService.js'
import { listarProfissionais } from './profissionaisService.js'

const BASE_SUGGESTIONS = Object.freeze([
  'Quais serviços vocês oferecem?',
  'Quais são os horários de funcionamento?',
  'Como faço para agendar?',
  'Posso cancelar um agendamento?'
])

const BUSINESS_INFO = {
  hours: 'Funcionamos de segunda a sábado, das 9h às 18h. Aos domingos atendemos apenas com agendamento prévio.',
  address: 'Rua dos Pets, 123 - Centro, São Paulo/SP',
  phone: '(11) 99999-0000',
  whatsapp: '(11) 98888-0000'
}

function normalize (text = '') {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function includesAny (text, keywords) {
  return keywords.some(keyword => text.includes(keyword))
}

function formatCurrency (value) {
  if (value === null || value === undefined) return 'sob consulta'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

function buildSuggestions (...extra) {
  const set = new Set(BASE_SUGGESTIONS)
  extra.forEach(item => {
    if (item) set.add(item)
  })
  return Array.from(set)
}

export async function responderMensagem ({ message }) {
  const suggestions = buildSuggestions()

  if (!message || !message.trim()) {
    return {
      reply: 'Olá! Sou a assistente virtual da Banho & Tosa. Posso te ajudar a conhecer nossos serviços, horários e como agendar um atendimento.',
      suggestions
    }
  }

  const normalized = normalize(message)

  if (includesAny(normalized, ['servic', 'banho', 'tosa', 'pacote'])) {
    const servicos = await listarServicos()
    if (!servicos.length) {
      return {
        reply: 'Estamos atualizando nossos serviços no momento. Tente novamente em instantes ou fale direto com a equipe pelo telefone.',
        suggestions: buildSuggestions('Como faço para agendar?', 'Qual o telefone de contato?')
      }
    }

    const lista = servicos
      .map(servico => `• ${servico.nome_servico} (${formatCurrency(servico.valor)})`)
      .join('\n')

    return {
      reply: `Esses são alguns dos nossos serviços atuais:\n${lista}\nVocê pode conferir mais detalhes e agendar direto pelo painel ou comigo. É só dizer!`,
      suggestions: buildSuggestions('Como faço para agendar?', 'Quais são os horários de funcionamento?')
    }
  }

  if (includesAny(normalized, ['horario', 'funcionamento', 'abrem', 'fecham', 'aberto'])) {
    return {
      reply: `${BUSINESS_INFO.hours}\nSe precisar de um horário especial, posso verificar com nossa equipe para você.`,
      suggestions: buildSuggestions('Como faço para agendar?', 'Quais serviços vocês oferecem?')
    }
  }

  if (includesAny(normalized, ['agend', 'marcar', 'horario disponivel', 'agendar'])) {
    return {
      reply: 'Para agendar, faça login ou crie sua conta, cadastre o pet e escolha o serviço. Você também pode ir na aba “Agendar serviço” e selecionar o melhor horário disponível.',
      suggestions: buildSuggestions('Quais serviços vocês oferecem?', 'Posso cancelar um agendamento?')
    }
  }

  if (includesAny(normalized, ['cancel', 'desmarc'])) {
    return {
      reply: 'Você pode cancelar um agendamento com até 2 horas de antecedência direto pelo painel em “Agendamentos”. Se precisar de ajuda, me avise que encaminho para nossa equipe.',
      suggestions: buildSuggestions('Quais serviços vocês oferecem?', 'Como faço para agendar?')
    }
  }

  if (includesAny(normalized, ['profission', 'especialista', 'groomer'])) {
    const profissionais = await listarProfissionais()
    if (!profissionais.length) {
      return {
        reply: 'Nossa equipe está sendo atualizada neste momento. Em breve teremos novos profissionais disponíveis!',
        suggestions
      }
    }

    const lista = profissionais
      .map(pro => `• ${pro.nome} - contato: ${pro.telefone || 'sem telefone'} / ${pro.email}`)
      .join('\n')

    return {
      reply: `Temos uma equipe especializada pronta para atender:\n${lista}\nAo agendar um serviço você pode escolher o profissional disponível.`,
      suggestions: buildSuggestions('Como faço para agendar?', 'Quais são os horários de funcionamento?')
    }
  }

  if (includesAny(normalized, ['preco', 'valor', 'quanto', 'investimento'])) {
    const servicos = await listarServicos()
    if (!servicos.length) {
      return {
        reply: 'Os valores variam conforme o porte do pet e o tipo de serviço. Entre em contato pelo WhatsApp para receber um orçamento personalizado.',
        suggestions: buildSuggestions('Qual o WhatsApp de contato?', 'Quais serviços vocês oferecem?')
      }
    }

    const lista = servicos
      .map(servico => `• ${servico.nome_servico}: ${formatCurrency(servico.valor)}`)
      .join('\n')

    return {
      reply: `Os valores dos principais serviços são:\n${lista}\nNo momento do agendamento informamos o valor final conforme o perfil do pet.`,
      suggestions: buildSuggestions('Como faço para agendar?', 'Posso cancelar um agendamento?')
    }
  }

  if (includesAny(normalized, ['whats', 'zap', 'telefone', 'contato', 'falar'])) {
    return {
      reply: `Você pode falar com nossa equipe pelos canais a seguir:\n• Telefone: ${BUSINESS_INFO.phone}\n• WhatsApp: ${BUSINESS_INFO.whatsapp}\n• Endereço: ${BUSINESS_INFO.address}`,
      suggestions: buildSuggestions('Quais serviços vocês oferecem?', 'Como faço para agendar?')
    }
  }

  if (includesAny(normalized, ['enderec', 'local', 'onde', 'ficam'])) {
    return {
      reply: `Estamos localizados em ${BUSINESS_INFO.address}. Há estacionamento conveniado ao lado da loja.`,
      suggestions: buildSuggestions('Quais são os horários de funcionamento?', 'Como faço para agendar?')
    }
  }

  if (includesAny(normalized, ['obrigad', 'valeu', 'perfeito'])) {
    return {
      reply: 'Eu que agradeço! Se precisar de mais alguma coisa é só me chamar. 🐾',
      suggestions
    }
  }

  return {
    reply: 'Ainda não tenho informações sobre isso, mas posso te ajudar com nossos serviços, horários, valores ou contato. Qual dessas opções você gostaria de saber?',
    suggestions
  }
}

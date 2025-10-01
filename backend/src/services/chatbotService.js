import { listarServicos } from './servicosService.js'
import { listarProfissionais } from './profissionaisService.js'

const BASE_SUGGESTIONS = Object.freeze([
  'Quais serviços premium vocês oferecem?',
  'Quais são os horários de funcionamento?',
  'Como faço para agendar?',
  'Quais são as formas de pagamento?',
  'Como preparar meu pet para o atendimento?',
  'Quero falar com um especialista humano'
])

const BUSINESS_INFO = {
  hours: 'Funcionamos de segunda a sábado, das 9h às 18h. Aos domingos atendemos apenas com agendamento prévio.',
  address: 'Rua dos Pets, 123 - Centro, São Paulo/SP',
  phone: '(11) 99999-0000',
  whatsapp: '(11) 98888-0000',
  email: 'contato@banhoetosa.com'
}

const HUMAN_HANDOFF =
  'Se preferir falar com uma pessoa da equipe, me avise escrevendo "quero falar com um humano" que eu conecto você rapidinho.'

const KNOWLEDGE_BASE = [
  {
    keywords: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'opa', 'oii', 'fala', 'salve'],
    responses: [
      'Oi! Eu sou a Luma 💜 Que alegria ter você por aqui. Me conta como posso deixar o dia do seu pet mais incrível?',
      'Olá! Aqui é a Luma, sua concierge pet. Quer saber sobre serviços, agendamentos, profissionais ou promoções? Estou pronta!',
      'Oi oi! Obrigada por me chamar. Já posso te indicar um serviço, abrir a agenda ou só bater um papo sobre os cuidados com o seu companheiro.'
    ],
    suggestions: ['Como faço para agendar?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['tudo bem', 'como voce esta', 'como vai', 'como vc esta', 'como vc ta', 'como vai voce'],
    responses: [
      'Estou muito bem e animada para cuidar do seu pet! Aproveita e me conta como posso ajudar por aí.',
      'Por aqui tudo ótimo, obrigada por perguntar! Se precisar de sugestões personalizadas é só falar.',
      'Sempre feliz quando alguém me chama. Se tiver alguma dúvida, manda ver que eu esclareço.'
    ],
    suggestions: ['Quais são as formas de pagamento?', 'Como preparar meu pet para o atendimento?']
  },
  {
    keywords: ['quem e voce', 'quem é você', 'qual seu nome', 'voce e humano', 'vc e humano', 'voce é um robo', 'vc é um robo', 'você é real', 'sobre voce'],
    responses: [
      'Sou a Luma, a assistente inteligente da Banho & Tosa Premium. Fui treinada com o conhecimento da nossa equipe para responder como se estivesse na recepção te recebendo com um sorriso.',
      'Pode me chamar de Luma! Eu acompanho toda a experiência digital da Banho & Tosa Premium e estou sempre pronta para orientar agendamentos, serviços e cuidados com pets.',
      'Aqui é a Luma 🐾. Fui criada para facilitar a sua vida: explico serviços, faço pré-reservas, compartilho dicas e aciono o time humano sempre que necessário.'
    ],
    suggestions: ['Quero falar com um especialista humano', 'Como faço para agendar?']
  },
  {
    keywords: ['humano', 'pessoa', 'atendente', 'suporte humano', 'falar com alguem', 'falar com alguém', 'falar com uma pessoa', 'atendimento humano'],
    responses: [
      () =>
        `Claro! Já deixo os contatos:
• Telefone: ${BUSINESS_INFO.phone}
• WhatsApp: ${BUSINESS_INFO.whatsapp}
• E-mail: ${BUSINESS_INFO.email}
Nossa equipe responde rapidinho nos horários comerciais. ${HUMAN_HANDOFF}`,
      () =>
        `Combinado, vou te direcionar para o time humano. Enquanto isso, salva estes canais: telefone ${BUSINESS_INFO.phone}, WhatsApp ${BUSINESS_INFO.whatsapp} e e-mail ${BUSINESS_INFO.email}.`,
      () =>
        `Sem problemas! Você pode chamar nossa equipe pelo WhatsApp ${BUSINESS_INFO.whatsapp} ou ligar no ${BUSINESS_INFO.phone}. Se preferir, também posso registrar sua mensagem aqui.`
    ],
    suggestions: ['Quais são os horários de funcionamento?', 'Qual o número do WhatsApp?']
  },
  {
    keywords: ['pagamento', 'forma de pagamento', 'pagamentos', 'pix', 'cartao', 'cartão', 'credito', 'crédito', 'debito', 'débito', 'dinheiro', 'parcelar'],
    responses: [
      'Aceitamos Pix, cartão de crédito e débito (inclusive por aproximação) e dinheiro. Para pacotes, parcelamos em até 3x sem juros. Fica à vontade para escolher a melhor opção!',
      'Você pode pagar como preferir: Pix instantâneo, cartões de crédito e débito das principais bandeiras, dinheiro ou transferência. Em planos de assinatura, o pagamento pode ser recorrente no cartão.',
      'Temos várias opções: Pix, cartões de crédito/débito, dinheiro e até link de pagamento para garantir sua vaga com antecedência. É só me avisar qual prefere.'
    ],
    suggestions: ['Quais serviços premium vocês oferecem?', 'Existe algum plano de fidelidade?']
  },
  {
    keywords: ['preparar', 'preparo', 'antes do banho', 'antes da tosa', 'levar algo', 'o que levar', 'orientacao pre', 'dica pre atendimento'],
    responses: [
      'Traga o pet com a carteirinha de vacinação atualizada, evite alimentá-lo até 2h antes do banho e, se ele usar algum produto específico recomendado pelo veterinário, pode trazer também. Ah, e uma caminhada leve antes ajuda a gastar energia! 😊',
      'Antes do atendimento, deixe o pet sem acessórios muito apertados, ofereça água fresca e faça um passeio rápido. Se ele tiver alguma sensibilidade, me avisa para eu informar o time técnico.',
      'O ideal é chegar com alguns minutinhos de antecedência, trazer os itens de uso pessoal do pet (como medicação ou shampoo indicado) e informar qualquer restrição de saúde. Assim garantimos um cuidado VIP.'
    ],
    suggestions: ['Como faço para agendar?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['pos servico', 'pós serviço', 'depois do banho', 'pos banho', 'pos tosa', 'pos atendimento', 'cuidados depois'],
    responses: [
      'Depois do atendimento mantenha o pet hidratado, ofereça uma refeição leve e evite expor ao frio nas primeiras horas. Se notar qualquer sensibilidade na pele, me avisa que eu acompanho com o time técnico.',
      'O ideal é observar o pet nas primeiras horas, garantir que ele tenha um cantinho confortável para descansar e evitar brincadeiras muito intensas logo após hidratações profundas.',
      'Após o banho ou tosa premium, pentear os pelos diariamente ajuda a manter o resultado. Qualquer alteração que perceber, me manda uma mensagem e eu monitoro com os especialistas.'
    ],
    suggestions: ['Tem dicas para manter o pelo saudável?', 'Quando devo agendar o próximo banho?']
  },
  {
    keywords: ['pelo saudavel', 'pelo saudável', 'pelagem', 'manter o pelo', 'escovar', 'hidratar pelo', 'cuidados com pelo'],
    responses: [
      'Escove o pelo diariamente para evitar nós, utilize escova específica para o porte do pet e finalize com um spray hidratante suave. Entre os banhos no estúdio, ofereça alimentação rica em ômegas para reforçar o brilho natural.',
      'Uma boa rotina inclui escovação frequente, hidratação leve com produtos aprovados para pets e check-ups dermatológicos anuais. Se quiser, indico os cosméticos mais adequados para o tipo de pelagem do seu pet.',
      'Mantenha a pelagem saudável com escovações curtas todos os dias, snacks ricos em ácidos graxos e hidratações profissionais mensais. Eu posso montar um kit home care personalizado pra você.'
    ],
    suggestions: ['Quais serviços premium vocês oferecem?', 'Existe algum plano de fidelidade?']
  },
  {
    keywords: ['produto', 'produtos', 'vocês vendem', 'linha home care', 'shampoo', 'condicionador', 'cosmeticos', 'cosméticos', 'loja'],
    responses: [
      'Temos uma curadoria de cosméticos premium para levar para casa: shampoos hipoalergênicos, máscaras de hidratação, perfumes e itens de cuidado oral. Posso separar uma lista personalizada para o perfil do seu pet.',
      'Sim! Disponibilizamos kits home care com produtos aprovados pelos nossos groomers. Tem opções para pelagem longa, curta, antialérgicos e até relaxantes para pets ansiosos.',
      'Contamos com uma lojinha boutique repleta de produtos: acessórios, laços, bandanas, snacks naturais e cosméticos premium. Posso mandar fotos e valores se quiser.'
    ],
    suggestions: ['Existe algum plano de fidelidade?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['leva e traz', 'levam e trazem', 'buscar', 'delivery pet', 'motorista', 'transporte', 'retirada', 'busca'],
    responses: [
      'Temos serviço de leva e traz com equipe treinada e carros climatizados. Agendamos um intervalo de 30 minutos e enviamos atualização assim que o pet chega ao estúdio.',
      'Se preferir, buscamos e devolvemos seu pet com todo conforto. Utilizamos caixas higienizadas, cintos de segurança e enviamos fotos pelo WhatsApp durante o trajeto.',
      'Nosso motorista pet friendly pode buscar seu melhor amigo em casa. Só precisamos confirmar endereço, melhor horário e se há alguma instrução especial de acesso.'
    ],
    suggestions: ['Quais são os horários de funcionamento?', 'Como faço para agendar?']
  },
  {
    keywords: ['promocao', 'promoção', 'desconto', 'cupom', 'fidelidade', 'plano', 'assinatura', 'pacote', 'mensalidade'],
    responses: [
      'Oferecemos plano de fidelidade com cashback em cada banho e upgrade gratuito em hidratação a cada 5 visitas. Para pacotes mensais há desconto progressivo.',
      'Temos combos especiais para quem agenda banho e tosa juntos, além de mimos de aniversário para os pets cadastrados. Posso consultar condições personalizadas para você!',
      'Clientes VIP contam com assinatura mensal com horários fixos e kit home care incluso. Se tiver interesse, eu já peço para um especialista entrar em contato.'
    ],
    suggestions: ['Quais serviços premium vocês oferecem?', 'Quais são as formas de pagamento?']
  },
  {
    keywords: ['tempo', 'demora', 'quanto tempo', 'duracao', 'duração', 'leva quanto', 'horas', 'minutos'],
    responses: [
      'Um banho completo leva em média 1h20 e a tosa estilizada até 2h, variando conforme porte e comportamento do pet. Aviso por mensagem assim que ele estiver pronto.',
      'Costumamos reservar cerca de 90 minutos para banho premium e hidratação. Para cortes especiais ou spa relaxante pode chegar a 2h30.',
      'O tempo depende do serviço e do perfil do pet. Antes de começar eu te passo uma estimativa e te mantenho atualizado durante o processo.'
    ],
    suggestions: ['Como faço para agendar?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['proximo banho', 'próximo banho', 'frequencia banho', 'frequência banho', 'intervalo banho', 'quantos banhos', 'banho por mes', 'banho por mês'],
    responses: [
      'Para a maioria dos cães, um banho a cada 15 dias mantém a pele equilibrada. Pets de pelagem longa ou que fazem atividades ao ar livre podem aproveitar semanalmente, sempre com produtos adequados.',
      'Gatos costumam precisar de banho profissional a cada 30-45 dias, enquanto cães de pelo curto ficam ótimos com intervalos de 15 a 20 dias. Sempre observamos o estilo de vida do pet antes de recomendar.',
      'A frequência ideal depende do porte, tipo de pelo e rotina. Posso analisar o perfil do seu pet e montar um calendário automático para você receber lembretes personalizados.'
    ],
    suggestions: ['Tem dicas para manter o pelo saudável?', 'Existe algum plano de fidelidade?']
  },
  {
    keywords: ['ansioso', 'nervoso', 'agitado', 'mede', 'morde', 'estressado', 'medo', 'trauma', 'pet dificil'],
    responses: [
      'Nossa equipe é especializada em pets sensíveis. Utilizamos técnicas de adaptação gradual, aromaterapia leve e pausas estratégicas. Conte tudo que seu pet gosta ou não para ajustarmos a experiência.',
      'Temos uma sala silenciosa e protocolos para pets ansiosos: música relaxante, reforço positivo e tempo extra para aproximação. Se precisar, marcamos um encontro de ambientação antes.',
      'Pode ficar tranquilo! Trabalhamos com manejo gentil e reforço positivo. Se seu pet tiver algum gatilho específico, me conta que oriento o time a agir com cuidado redobrado.'
    ],
    suggestions: ['Como faço para agendar?', 'O que acontece se eu precisar cancelar?']
  },
  {
    keywords: ['filhote', 'filhotes', 'idoso', 'senior', 'sênior', 'gato', 'felino', 'shorthair', 'longhair'],
    responses: [
      'Para filhotes, priorizamos sessões curtas e carinhosas com intervalos de descanso. Em idosos, usamos mesas com suporte ortopédico. Para gatinhos temos ambiente separado, sem cães circulando.',
      'Cada fase da vida merece um cuidado especial: filhotes recebem adaptação lúdica, adultos um spa completo e seniores um protocolo gentil para articulações. Para gatos contamos com groomers especializados.',
      'Seja para cães ou gatos, ajustamos temperatura da água, cosméticos e manejo conforme idade, porte e histórico de saúde. Só me indicar detalhes que preparo tudo.'
    ],
    suggestions: ['Como preparar meu pet para o atendimento?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['vacina', 'vacinado', 'saude', 'atestado', 'documento', 'comprovante'],
    responses: [
      'Pedimos que o pet esteja com as vacinas em dia (V8/V10 para cães, V4 para gatos) e vermifugado. Traga a carteirinha ou nos envie foto antecipadamente.',
      'Por segurança, conferimos as principais vacinas e orientamos sobre controle de pulgas e carrapatos. Se houver qualquer restrição médica, nos avise para seguirmos o protocolo adequado.',
      'A carteirinha de vacinação atualizada garante uma experiência segura para todos. Se estiver faltando alguma dose, posso indicar clínicas parceiras.'
    ],
    suggestions: ['Como preparar meu pet para o atendimento?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['admin', 'dashboard', 'relatorio', 'relatório', 'gestao', 'gestão', 'painel administrativo', 'area do admin'],
    responses: [
      'Administradores têm acesso ao dashboard completo, gestão de clientes, profissionais, agenda e indicadores em tempo real. Basta fazer login com perfil administrativo e acessar “Dashboard”.',
      'Se você é admin, após o login o menu lateral libera o painel com métricas, controle de pets, agenda consolidada e configurações avançadas.',
      'O ambiente administrativo fica em /app/dashboard e /app/gestao. Caso não visualize, confira se sua conta está com permissão de administrador ou me peça para acionar o suporte.'
    ],
    suggestions: ['Quero falar com um especialista humano', 'Como faço para agendar?']
  },
  {
    keywords: ['login', 'entrar', 'senha', 'esqueci a senha', 'nao consigo entrar', 'não consigo entrar', 'acesso'],
    responses: [
      'Você pode abrir o modal de login pela landing page e entrar com seu e-mail e senha. Se esqueceu a senha, clique em “Esqueci minha senha” que enviamos um link de redefinição.',
      'Para acessar, clique em “Entrar” na landing page, informe seu e-mail e senha e pronto. Se der erro, confirme se o cadastro está ativo ou me peça ajuda para revisar seus dados.',
      'O login está sempre disponível no topo da página. Caso a senha esteja incorreta, tente recuperar pelo e-mail cadastrado que te guiamos passo a passo.'
    ],
    suggestions: ['Quero me cadastrar', 'Como faço para agendar?']
  },
  {
    keywords: ['cadastro', 'cadastrar', 'registrar', 'registrar-se', 'criar conta', 'fazer cadastro'],
    responses: [
      'Para se cadastrar é só abrir o modal “Criar conta” na landing page, informar seus dados e pronto. Ao finalizar, você já entra logado para cadastrar o pet e agendar.',
      'Clique em “Criar conta” na página inicial, preencha nome, telefone, e-mail e senha. Em segundos você já consegue completar o perfil e agendar.',
      'O cadastro é simples: abra o formulário na landing, confirme seus dados e conclua. Qualquer dúvida me chama que acompanho com você.'
    ],
    suggestions: ['Como faço para agendar?', 'Como cadastrar meu pet?']
  },
  {
    keywords: ['cadastrar pet', 'cadastro pet', 'novo pet', 'pet novo', 'adicionar pet'],
    responses: [
      'Depois de entrar, vá em “Pets” e clique em “Adicionar pet”. Preencha nome, porte, temperamento e observações de saúde para receber recomendações personalizadas.',
      'Você pode cadastrar quantos pets quiser no painel. Assim conseguimos montar protocolos específicos e agilizar agendamentos futuros.',
      'No menu “Pets” é possível incluir um novo amigo com poucos cliques. Se tiver alguma condição de saúde, anota lá pra equipe saber antes do atendimento.'
    ],
    suggestions: ['Como faço para agendar?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['chat agendar', 'agendar pelo chat', 'marcar por aqui', 'agendar com voce', 'abrir agenda'],
    responses: [
      'Posso abrir a agenda para você! Me diga o serviço desejado, preferências de data e período que eu direciono para o fluxo rápido de agendamento.',
      'Claro, estamos a poucos passos de confirmar seu horário. Informe serviço, profissional favorito (se tiver) e melhor período e eu encaminho para o painel já pré-preenchido.',
      'Vamos agendar sim! Me passa o serviço e o melhor dia que eu abro a agenda autenticada para concluir em segundos.'
    ],
    suggestions: ['Como faço para agendar?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['obrigado', 'obrigada', 'valeu', 'perfeito', 'maravilha', 'show', 'top'],
    responses: [
      'Eu que agradeço! Qualquer coisa é só chamar, estou sempre por aqui. 🐾',
      'Obrigada você por confiar na gente! Se surgir outra dúvida ou quiser agendar, conte comigo.',
      'Fico feliz em ajudar! Quando quiser marcar o próximo cuidado do seu pet, é só me avisar.'
    ],
    suggestions: ['Quando devo agendar o próximo banho?', 'Quais serviços premium vocês oferecem?']
  },
  {
    keywords: ['tchau', 'ate logo', 'até logo', 'ate mais', 'até mais', 'boa noite', 'boa tarde', 'ate amanha', 'até amanhã'],
    responses: [
      'Até breve! Dá um abraço no seu pet por mim 💜',
      'Tchau tchau! Sempre que precisar de dicas ou quiser agendar é só chamar.',
      'Foi um prazer falar com você. Até a próxima experiência premium!' 
    ],
    suggestions: ['Quais serviços premium vocês oferecem?', 'Quais são os horários de funcionamento?']
  },
  {
    keywords: ['nao gostei', 'não gostei', 'reclam', 'problema', 'erro', 'ruim', 'péssimo', 'pessimo'],
    responses: [
      'Sinto muito por isso. Me conta com detalhes o que aconteceu que eu aciono imediatamente nossa coordenação para resolver.',
      'Nossa intenção é sempre entregar uma experiência impecável. Vou registrar sua situação e chamar um especialista humano para cuidar disso já.',
      'Agradeço por compartilhar. Deixe-me coletar todas as informações para encaminhar ao time responsável e retornar com a solução.'
    ],
    suggestions: ['Quero falar com um especialista humano', 'Qual o número do WhatsApp?']
  },
  {
    keywords: ['elogio', 'amei', 'perfeito', 'sensacional', 'gostei muito', 'amei demais', 'incrivel', 'incrível'],
    responses: [
      'Que bom que gostou! Já vou repassar o carinho para a equipe. Eles vão amar saber.',
      'Fico muito feliz em ouvir isso! Nosso time se dedica para cada pet sair brilhando.',
      'Uau, obrigada! Comentários assim enchem o coração da equipe. Posso ajudar com mais alguma informação?' 
    ],
    suggestions: ['Quando devo agendar o próximo banho?', 'Existe algum plano de fidelidade?']
  }
]

function normalize (text = '') {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function includesAny (text, keywords = []) {
  return keywords.some(keyword => text.includes(keyword))
}

function pickRandom (list = []) {
  if (!Array.isArray(list) || list.length === 0) return ''
  return list[Math.floor(Math.random() * list.length)]
}

function buildSuggestions (...extra) {
  const set = new Set(BASE_SUGGESTIONS)
  extra.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(value => {
        if (value) set.add(value)
      })
    } else if (item) {
      set.add(item)
    }
  })
  return Array.from(set)
}

function createResponse (reply, ...suggestions) {
  return {
    reply,
    suggestions: buildSuggestions(...suggestions)
  }
}

function getKnowledgeBaseResponse (normalized) {
  for (const topic of KNOWLEDGE_BASE) {
    const matches =
      typeof topic.match === 'function'
        ? topic.match(normalized)
        : includesAny(normalized, topic.keywords)

    if (matches) {
      const candidate = pickRandom(topic.responses)
      const reply =
        typeof candidate === 'function'
          ? candidate({ normalized, businessInfo: BUSINESS_INFO })
          : candidate

      return createResponse(reply, topic.suggestions)
    }
  }

  return null
}

function formatCurrency (value) {
  if (value === null || value === undefined) return 'sob consulta'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

export async function responderMensagem ({ message }) {
  const suggestions = buildSuggestions()

  if (!message || !message.trim()) {
    return {
      reply:
        'Olá! Sou a Luma, assistente virtual da Banho & Tosa Premium. Posso explicar serviços, horários, preços, planos de fidelidade, preparar seu pet para o atendimento ou encaminhar você para o time humano.',
      suggestions
    }
  }

  const normalized = normalize(message)

  if (includesAny(normalized, ['servic', 'banho', 'tosa', 'pacote', 'spa', 'hidrata'])) {
    const servicos = await listarServicos()
    if (!servicos.length) {
      return createResponse(
        'Estamos atualizando nossa vitrine de serviços neste momento. Se quiser, posso pedir para alguém do time comercial te enviar a lista completa pelo WhatsApp.',
        ['Como faço para agendar?', 'Qual o número do WhatsApp?']
      )
    }

    const lista = servicos
      .map(servico => `• ${servico.nome_servico} (${formatCurrency(servico.valor)})`)
      .join('\n')

    return createResponse(
      `Aqui está um panorama dos nossos serviços premium:\n${lista}\nSe quiser, já posso abrir a agenda no horário que preferir ou explicar cada opção em detalhes.`,
      ['Como faço para agendar?', 'Quais são as formas de pagamento?']
    )
  }

  if (includesAny(normalized, ['horario', 'funcionamento', 'abrem', 'fecham', 'aberto', 'expediente'])) {
    return createResponse(
      `${BUSINESS_INFO.hours}\nSe precisar de um horário especial, me avise que verifico disponibilidade exclusiva para você.`,
      ['Como faço para agendar?', 'Como funciona o serviço de leva e traz?']
    )
  }

  if (includesAny(normalized, ['agend', 'marcar', 'horario disponivel', 'agendar', 'reserva', 'agendamento'])) {
    return createResponse(
      'Para agendar basta fazer login (ou criar sua conta), cadastrar o pet e escolher o serviço. Na landing page você já encontra o botão “Agendar agora” com o fluxo guiado e eu posso pré-preencher tudo para você.',
      ['Quero me cadastrar', 'Como preparar meu pet para o atendimento?']
    )
  }

  if (includesAny(normalized, ['cancel', 'desmarc', 'remarcar', 'remarcacao'])) {
    return createResponse(
      'Você pode cancelar ou remarcar com até 2 horas de antecedência direto na aba “Agendamentos”. Se preferir ajuda, é só me avisar que envolvo o time humano para cuidar do seu pedido.',
      ['Quais são os horários de funcionamento?', 'Quais serviços premium vocês oferecem?']
    )
  }

  if (includesAny(normalized, ['profission', 'especialista', 'groomer', 'quem vai atender', 'quem cuida'])) {
    const profissionais = await listarProfissionais()
    if (!profissionais.length) {
      return createResponse(
        'Nossa equipe está sendo atualizada neste momento. Assim que a nova escala for publicada, te aviso com os horários disponíveis.',
        ['Como faço para agendar?', 'Quero falar com um especialista humano']
      )
    }

    const lista = profissionais
      .map(pro => `• ${pro.nome} - contato: ${pro.telefone || 'sem telefone'} / ${pro.email}`)
      .join('\n')

    return createResponse(
      `Conheça alguns dos nossos especialistas:\n${lista}\nNa hora do agendamento você consegue escolher o profissional disponível ou deixar que eu sugira quem combina mais com seu pet.`,
      ['Como faço para agendar?', 'Existe algum plano de fidelidade?']
    )
  }

  if (includesAny(normalized, ['preco', 'valor', 'quanto', 'investimento', 'tabela', 'orcamento', 'orçamento'])) {
    const servicos = await listarServicos()
    if (!servicos.length) {
      return createResponse(
        'Os valores variam conforme o porte do pet e o tipo de serviço. Posso acionar um especialista para te enviar um orçamento personalizado pelo WhatsApp.',
        ['Qual o número do WhatsApp?', 'Quais serviços premium vocês oferecem?']
      )
    }

    const lista = servicos
      .map(servico => `• ${servico.nome_servico}: ${formatCurrency(servico.valor)}`)
      .join('\n')

    return createResponse(
      `Esses são os valores de referência dos nossos principais serviços:\n${lista}\nNa confirmação do agendamento mostramos o valor final conforme o perfil do pet.`,
      ['Quais são as formas de pagamento?', 'Existe algum plano de fidelidade?']
    )
  }

  if (includesAny(normalized, ['whats', 'zap', 'telefone', 'contato', 'falar', 'numero', 'número'])) {
    return createResponse(
      `Você pode falar com nossa equipe pelos canais a seguir:\n• Telefone: ${BUSINESS_INFO.phone}\n• WhatsApp: ${BUSINESS_INFO.whatsapp}\n• E-mail: ${BUSINESS_INFO.email}\n• Endereço: ${BUSINESS_INFO.address}`,
      ['Quais serviços premium vocês oferecem?', 'Quero falar com um especialista humano']
    )
  }

  if (includesAny(normalized, ['enderec', 'local', 'onde', 'ficam', 'chegar', 'localizacao'])) {
    return createResponse(
      `Estamos localizados em ${BUSINESS_INFO.address}. Temos estacionamento conveniado e serviço de leva e traz para sua comodidade.`,
      ['Como funciona o serviço de leva e traz?', 'Quais são os horários de funcionamento?']
    )
  }

  const knowledgeResponse = getKnowledgeBaseResponse(normalized)
  if (knowledgeResponse) {
    return knowledgeResponse
  }

  return createResponse(
    'Ainda não tenho informações detalhadas sobre esse assunto, mas posso te ajudar com serviços, horários, valores, preparação do pet, promoções ou colocar você em contato com o time humano. O que prefere saber agora?',
    ['Quais serviços premium vocês oferecem?', 'Quero falar com um especialista humano']
  )
}

import { responderMensagem } from '../services/chatbotService.js'

export async function enviarMensagem (req, res) {
  const { message } = req.body

  if (message !== undefined && typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem deve ser um texto.' })
  }

  const resposta = await responderMensagem({ message })
  res.json(resposta)
}

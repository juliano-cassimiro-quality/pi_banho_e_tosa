import { autenticarUsuario, recuperarSenha, redefinirSenha } from '../services/authService.js'
import { sendNotification, NotificationType } from '../utils/notifications.js'

export async function login (req, res) {
  const { email, senha } = req.body
  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha' })
  }

  const resultado = await autenticarUsuario({ email, senha })
  res.json(resultado)
}

export async function solicitarRecuperacao (req, res) {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Informe o e-mail cadastrado' })
  }

  const { token } = await recuperarSenha({ email })
  sendNotification({
    type: NotificationType.PASSWORD_RECOVERY,
    recipient: email,
    message: `Token de recuperação: ${token}`
  })
  res.json({ mensagem: 'Token de recuperação enviado' })
}

export async function redefinir (req, res) {
  const { token, novaSenha } = req.body
  if (!token || !novaSenha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' })
  }

  await redefinirSenha({ token, novaSenha })
  res.json({ mensagem: 'Senha atualizada com sucesso' })
}

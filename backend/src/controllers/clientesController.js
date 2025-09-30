import { criarCliente, listarClientes } from '../services/clientesService.js'

export async function listar (req, res) {
  const clientes = await listarClientes()
  res.json(clientes)
}

export async function criar (req, res) {
  const { nome, telefone, email, senha } = req.body
  if (!nome || !telefone || !email || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' })
  }

  const cliente = await criarCliente({ nome, telefone, email, senha })
  res.status(201).json(cliente)
}

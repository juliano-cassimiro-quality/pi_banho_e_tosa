import { cadastrarAnimal, listarAnimaisPorCliente } from '../services/animaisService.js'

export async function criar (req, res) {
  const { idCliente, nome, especie, porte, idade, observacoes } = req.body
  if (!idCliente || !nome || !especie) {
    return res.status(400).json({ error: 'Cliente, nome e espécie são obrigatórios' })
  }

  const animal = await cadastrarAnimal({ idCliente, nome, especie, porte, idade, observacoes })
  res.status(201).json(animal)
}

export async function listarPorCliente (req, res) {
  const { idCliente } = req.params
  const animais = await listarAnimaisPorCliente(idCliente)
  res.json(animais)
}

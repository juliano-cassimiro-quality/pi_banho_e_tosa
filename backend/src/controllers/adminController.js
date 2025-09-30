import { obterDashboard } from '../services/adminService.js'

export async function dashboard (req, res) {
  const dados = await obterDashboard()
  res.json(dados)
}

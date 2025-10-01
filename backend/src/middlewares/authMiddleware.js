import jwt from 'jsonwebtoken'

export function authenticate (roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const [, token] = authHeader.split(' ')

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      req.user = payload

      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      next()
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' })
    }
  }
}

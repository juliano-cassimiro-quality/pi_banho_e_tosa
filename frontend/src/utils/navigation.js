const ROLE_DEFAULTS = {
  admin: 'dashboard',
  profissional: 'gestao'
}

const DEFAULT_CLIENT_PATH = 'agendamentos'

export function getDefaultNestedPath (role) {
  return ROLE_DEFAULTS[role] || DEFAULT_CLIENT_PATH
}

export function getDefaultPath (role) {
  return `/app/${getDefaultNestedPath(role)}`
}

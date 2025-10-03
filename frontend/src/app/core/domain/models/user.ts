export interface User {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  role: 'CLIENTE' | 'PROFISSIONAL';
  token?: string;
}

export function roleLabel(role: User['role']): string {
  switch (role) {
    case 'CLIENTE':
      return 'Cliente';
    case 'PROFISSIONAL':
      return 'Profissional';
    default:
      return role;
  }
}

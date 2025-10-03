import { Pet } from './pet';
import { User } from './user';

export type ServicoTipo = 'BANHO' | 'TOSA' | 'BANHO_E_TOSA';
export type StatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';

export interface Appointment {
  id: number;
  dataHora: string;
  duracaoMinutos: number;
  tipoServico: ServicoTipo;
  status: StatusAgendamento;
  observacoesCliente: string | null;
  observacoesProfissional: string | null;
  criadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
  animal: Pet;
  cliente: User;
  profissional: User | null;
}

export function statusLabel(status: StatusAgendamento): string {
  switch (status) {
    case 'AGENDADO':
      return 'Agendado';
    case 'CONFIRMADO':
      return 'Confirmado';
    case 'CONCLUIDO':
      return 'Concluído';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return status;
  }
}

export function serviceLabel(tipo: ServicoTipo): string {
  switch (tipo) {
    case 'BANHO':
      return 'Banho';
    case 'TOSA':
      return 'Tosa';
    case 'BANHO_E_TOSA':
      return 'Banho & Tosa';
    default:
      return tipo;
  }
}

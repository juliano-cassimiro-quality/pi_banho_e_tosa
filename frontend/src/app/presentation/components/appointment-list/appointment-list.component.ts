import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';

import {
  Appointment,
  StatusAgendamento,
  statusLabel as statusLabelFn,
  serviceLabel as serviceLabelFn
} from '../../../core/domain/models/appointment';
import { User } from '../../../core/domain/models/user';

export type AppointmentAction = 'cancel' | 'reschedule' | 'complete';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, DatePipe, NgClass],
  template: `
    <div class="list" *ngIf="appointments?.length; else empty">
      <article class="item" *ngFor="let appointment of appointments">
        <header>
          <div class="title">
            <span class="service">{{ serviceLabel(appointment.tipoServico) }}</span>
            <h3>{{ appointment.animal.nome }}</h3>
          </div>
          <span class="status" [ngClass]="appointment.status">{{ statusLabel(appointment.status) }}</span>
        </header>
        <dl>
          <div>
            <dt>Data e hora</dt>
            <dd>{{ appointment.dataHora | date: 'dd/MM/yyyy HH:mm' }}</dd>
          </div>
          <div>
            <dt>Cliente</dt>
            <dd>
              {{ appointment.cliente.nome }}
              <span class="muted">{{ appointment.cliente.telefone }}</span>
            </dd>
          </div>
          <div>
            <dt>Duração</dt>
            <dd>{{ appointment.duracaoMinutos }} min</dd>
          </div>
        </dl>
        <footer *ngIf="hasActions(appointment)">
          <button type="button" class="ghost" *ngIf="canReschedule(appointment)" (click)="emit('reschedule', appointment)">
            Reagendar
          </button>
          <button type="button" class="ghost" *ngIf="canCancel(appointment)" (click)="emit('cancel', appointment)">
            Cancelar
          </button>
          <button type="button" class="primary" *ngIf="canComplete(appointment)" (click)="emit('complete', appointment)">
            Concluir atendimento
          </button>
        </footer>
      </article>
    </div>
    <ng-template #empty>
      <p class="empty">Nenhum agendamento encontrado.</p>
    </ng-template>
  `,
  styles: [
    `
      .list {
        display: grid;
        gap: 1.5rem;
      }

      .item {
        background: rgba(15, 23, 42, 0.75);
        border-radius: 1.75rem;
        padding: 1.75rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        display: grid;
        gap: 1.5rem;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .title {
        display: grid;
        gap: 0.35rem;
      }

      .title h3 {
        margin: 0;
        font-size: 1.4rem;
      }

      .service {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #38bdf8;
      }

      .status {
        padding: 0.4rem 1rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border: 1px solid transparent;
      }

      .status.AGENDADO {
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.3);
        color: #60a5fa;
      }

      .status.CONFIRMADO {
        background: rgba(45, 212, 191, 0.18);
        border-color: rgba(45, 212, 191, 0.35);
        color: #5eead4;
      }

      .status.CONCLUIDO {
        background: rgba(34, 197, 94, 0.18);
        border-color: rgba(34, 197, 94, 0.35);
        color: #4ade80;
      }

      .status.CANCELADO {
        background: rgba(239, 68, 68, 0.18);
        border-color: rgba(239, 68, 68, 0.35);
        color: #fca5a5;
      }

      dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin: 0;
      }

      dt {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
      }

      dd {
        margin: 0.35rem 0 0;
        font-weight: 600;
      }

      .muted {
        display: block;
        font-weight: 400;
        font-size: 0.8rem;
        color: #94a3b8;
      }

      footer {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      button {
        border-radius: 0.85rem;
        padding: 0.6rem 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease;
      }

      button:hover {
        transform: translateY(-1px);
      }

      .ghost {
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: transparent;
        color: #e2e8f0;
      }

      .primary {
        border: none;
        background: linear-gradient(135deg, #38bdf8, #6366f1);
        color: #0f172a;
      }

      .empty {
        text-align: center;
        color: #94a3b8;
        padding: 2rem 0;
      }
    `
  ]
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] | null = null;
  @Input() role: User['role'] | null = null;

  @Output() action = new EventEmitter<{ type: AppointmentAction; appointment: Appointment }>();

  statusLabel(status: StatusAgendamento): string {
    return statusLabelFn(status);
  }

  serviceLabel(tipo: Appointment['tipoServico']): string {
    return serviceLabelFn(tipo);
  }

  hasActions(appointment: Appointment): boolean {
    return this.canCancel(appointment) || this.canReschedule(appointment) || this.canComplete(appointment);
  }

  canCancel(appointment: Appointment): boolean {
    return (
      this.role === 'CLIENTE' &&
      (appointment.status === 'AGENDADO' || appointment.status === 'CONFIRMADO')
    );
  }

  canReschedule(appointment: Appointment): boolean {
    if (appointment.status === 'CANCELADO' || appointment.status === 'CONCLUIDO') {
      return false;
    }
    return this.role === 'CLIENTE' || this.role === 'PROFISSIONAL';
  }

  canComplete(appointment: Appointment): boolean {
    return (
      this.role === 'PROFISSIONAL' &&
      appointment.status !== 'CANCELADO' &&
      appointment.status !== 'CONCLUIDO'
    );
  }

  emit(type: AppointmentAction, appointment: Appointment): void {
    this.action.emit({ type, appointment });
  }
}

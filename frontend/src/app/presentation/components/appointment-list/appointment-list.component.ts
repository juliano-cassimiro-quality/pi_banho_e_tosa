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
        background: var(--color-surface);
        border-radius: 1.75rem;
        padding: 1.75rem;
        border: 1px solid var(--color-border);
        display: grid;
        gap: 1.5rem;
        box-shadow: var(--shadow-sm);
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
        color: var(--color-heading);
      }

      .service {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-muted);
      }

      .status {
        padding: 0.4rem 1rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border: 1px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }

      .status.AGENDADO {
        background: color-mix(in srgb, var(--color-accent-soft) 60%, transparent);
        border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
        color: var(--color-accent-strong);
      }

      .status.CONFIRMADO {
        background: rgba(45, 212, 191, 0.18);
        border-color: rgba(45, 212, 191, 0.35);
        color: #0f766e;
      }

      .status.CONCLUIDO {
        background: rgba(34, 197, 94, 0.18);
        border-color: rgba(34, 197, 94, 0.35);
        color: #15803d;
      }

      .status.CANCELADO {
        background: var(--color-danger-soft);
        border-color: rgba(248, 113, 113, 0.35);
        color: var(--color-danger);
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
        color: var(--color-text-muted);
      }

      dd {
        margin: 0.35rem 0 0;
        font-weight: 600;
        color: var(--color-heading);
      }

      .muted {
        display: block;
        font-weight: 400;
        font-size: 0.8rem;
        color: var(--color-text-muted);
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
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }

      button:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }

      .ghost {
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text);
      }

      .primary {
        border: none;
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-strong) 100%);
        color: #ffffff;
        box-shadow: var(--shadow-sm);
      }

      .empty {
        text-align: center;
        color: var(--color-text-muted);
        padding: 2rem 0;
      }
    `
  ]
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] | null = null;
  @Input() role: User['role'] | null = null;
  @Output() action = new EventEmitter<{ type: AppointmentAction; appointment: Appointment }>();

  hasActions(appointment: Appointment): boolean {
    return this.role === 'PROFISSIONAL' || this.canComplete(appointment) || this.canCancel(appointment);
  }

  canReschedule(appointment: Appointment): boolean {
    return this.role === 'PROFISSIONAL' && appointment.status === 'AGENDADO';
  }

  canCancel(appointment: Appointment): boolean {
    return (
      (this.role === 'PROFISSIONAL' || this.role === 'CLIENTE') &&
      (appointment.status === 'AGENDADO' || appointment.status === 'CONFIRMADO')
    );
  }

  canComplete(appointment: Appointment): boolean {
    return this.role === 'PROFISSIONAL' && appointment.status === 'CONFIRMADO';
  }

  emit(type: AppointmentAction, appointment: Appointment): void {
    this.action.emit({ type, appointment });
  }

  statusLabel(status: StatusAgendamento): string {
    return statusLabelFn(status);
  }

  serviceLabel(service: Appointment['tipoServico']): string {
    return serviceLabelFn(service);
  }
}

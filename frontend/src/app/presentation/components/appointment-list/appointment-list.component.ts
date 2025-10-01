import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Appointment } from '../../../core/domain/models/appointment';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="list" *ngIf="appointments?.length; else empty">
      <article class="item" *ngFor="let appointment of appointments">
        <div>
          <strong>{{ appointment.petName }}</strong>
          <p class="meta">{{ appointment.ownerName }} · {{ appointment.service }}</p>
          <span class="date">{{ appointment.scheduledAt | date: 'dd/MM/yyyy HH:mm' }}</span>
        </div>
        <div class="actions">
          <span class="status" [class]="appointment.status">{{ statusLabel(appointment.status) }}</span>
          <select [value]="appointment.status" (change)="change.emit({ id: appointment.id, status: $any($event.target).value })">
            <option value="scheduled">Agendado</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </article>
    </div>
    <ng-template #empty>
      <p class="empty">Nenhum agendamento disponível.</p>
    </ng-template>
  `,
  styles: [
    `
      .list {
        display: grid;
        gap: 1rem;
      }

      .item {
        background: rgba(30, 41, 59, 0.9);
        border-radius: 1rem;
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .item strong {
        font-size: 1.1rem;
      }

      .meta {
        margin: 0.25rem 0;
        color: #94a3b8;
      }

      .date {
        color: #38bdf8;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .status {
        padding: 0.35rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .status.scheduled {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }

      .status.in_progress {
        background: rgba(249, 115, 22, 0.15);
        color: #f97316;
      }

      .status.done {
        background: rgba(34, 197, 94, 0.15);
        color: #22c55e;
      }

      .status.cancelled {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }

      select {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: inherit;
        border-radius: 0.75rem;
        padding: 0.45rem 0.75rem;
      }

      .empty {
        text-align: center;
        color: #94a3b8;
        padding: 2rem 0;
      }

      @media (max-width: 768px) {
        .item {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    `
  ]
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] | null = null;
  @Output() change = new EventEmitter<{ id: string; status: Appointment['status'] }>();

  statusLabel(status: Appointment['status']): string {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'in_progress':
        return 'Em andamento';
      case 'done':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }
}

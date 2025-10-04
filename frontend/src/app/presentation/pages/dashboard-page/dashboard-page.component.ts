import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { AppointmentListComponent, AppointmentAction } from '../../components/appointment-list/appointment-list.component';
import { ListAppointmentsUseCase } from '../../../core/application/use-cases/list-appointments.use-case';
import { CancelAppointmentUseCase } from '../../../core/application/use-cases/cancel-appointment.use-case';
import { RescheduleAppointmentUseCase } from '../../../core/application/use-cases/reschedule-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../../core/application/use-cases/complete-appointment.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { Appointment } from '../../../core/domain/models/appointment';
import { User } from '../../../core/domain/models/user';
import { LoadProfileUseCase } from '../../../core/application/use-cases/load-profile.use-case';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, AppHeaderComponent, MetricCardComponent, AppointmentListComponent],
  template: `
    <app-header (logout)="logout()"></app-header>
    <section class="dashboard">
      <header class="intro">
        <div>
          <p class="eyebrow">Panorama geral</p>
          <h1>Operação integrada ao backend</h1>
          <p class="description">
            Acompanhe indicadores chave, visualize agendamentos em tempo real e tome decisões verdes com confiança.
          </p>
        </div>
        <button class="refresh" type="button" (click)="load()" [disabled]="loading()">
          {{ loading() ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </header>

      <div class="metrics">
        <app-metric-card label="Agendados" [value]="scheduledAppointments()" icon="🗓"></app-metric-card>
        <app-metric-card label="Confirmados" [value]="confirmedAppointments()" icon="✅"></app-metric-card>
        <app-metric-card label="Concluídos" [value]="completedAppointments()" icon="🌱"></app-metric-card>
        <app-metric-card label="Cancelados" [value]="cancelledAppointments()" icon="⚠️"></app-metric-card>
      </div>

      <section class="panel">
        <header>
          <div>
            <h2>Próximos atendimentos</h2>
            <p class="description">
              Todas as ações refletem imediatamente nos endpoints /appointments do backend Spring Boot.
            </p>
          </div>
        </header>
        <app-appointment-list
          [appointments]="appointments()"
          [role]="user()?.role ?? null"
          (action)="handleAction($event)"
        ></app-appointment-list>
      </section>
    </section>
  `,
  styles: [
    `
      .dashboard {
        padding: 2.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem;
        display: grid;
        gap: 2.5rem;
      }

      .intro {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1.5rem;
        flex-wrap: wrap;
      }

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.75rem;
        color: var(--color-accent-strong);
        margin-bottom: 0.75rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.75rem);
        color: var(--color-heading);
      }

      .description {
        color: var(--color-text-muted);
        margin-top: 0.5rem;
        max-width: 60ch;
      }

      .refresh {
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        color: var(--color-text);
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-sm);
      }

      .refresh:hover:not([disabled]) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      .refresh[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
      }

      .panel {
        background: var(--color-surface);
        border-radius: 2rem;
        padding: 2.5rem;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
      }

      .panel header {
        margin-bottom: 2rem;
      }

      .panel h2 {
        margin: 0;
        color: var(--color-heading);
      }

      @media (max-width: 768px) {
        .panel {
          padding: 1.75rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly listAppointmentsUseCase = inject(ListAppointmentsUseCase);
  private readonly cancelAppointmentUseCase = inject(CancelAppointmentUseCase);
  private readonly rescheduleAppointmentUseCase = inject(RescheduleAppointmentUseCase);
  private readonly completeAppointmentUseCase = inject(CompleteAppointmentUseCase);
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  readonly appointments = signal<Appointment[] | null>(null);
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);

  readonly scheduledAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'AGENDADO').length
  );
  readonly confirmedAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'CONFIRMADO').length
  );
  readonly completedAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'CONCLUIDO').length
  );
  readonly cancelledAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'CANCELADO').length
  );

  ngOnInit(): void {
    this.loadProfileUseCase.execute().subscribe({
      next: (user: User) => this.user.set(user)
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.listAppointmentsUseCase.execute().subscribe({
      next: (appointments: Appointment[]) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: () => {
        this.appointments.set([]);
        this.loading.set(false);
      }
    });
  }

  handleAction(event: { type: AppointmentAction; appointment: Appointment }): void {
    const { type, appointment } = event;

    if (type === 'cancel') {
      const motivo = prompt('Informe o motivo do cancelamento');
      if (!motivo) {
        return;
      }
      this.cancelAppointmentUseCase.execute({ id: appointment.id, motivo }).subscribe({
        next: (updated: Appointment) => this.replaceAppointment(updated)
      });
      return;
    }

    if (type === 'reschedule') {
      const novaData = prompt('Informe a nova data (YYYY-MM-DD)');
      const novoHorario = prompt('Informe o novo horário (HH:mm)');
      if (!novaData || !novoHorario) {
        return;
      }
      this.rescheduleAppointmentUseCase.execute({ id: appointment.id, data: novaData, horario: novoHorario }).subscribe({
        next: (updated: Appointment) => this.replaceAppointment(updated)
      });
      return;
    }

    if (type === 'complete') {
      this.completeAppointmentUseCase.execute(appointment.id).subscribe({
        next: (updated: Appointment) => this.replaceAppointment(updated)
      });
    }
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }

  private replaceAppointment(updated: Appointment): void {
    this.appointments.set(
      (this.appointments() ?? []).map((appointment: Appointment) =>
        appointment.id === updated.id ? { ...appointment, ...updated } : appointment
      )
    );
  }
}

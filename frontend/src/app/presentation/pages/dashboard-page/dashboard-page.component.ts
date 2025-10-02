import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { AppointmentListComponent } from '../../components/appointment-list/appointment-list.component';
import { ListAppointmentsUseCase } from '../../../core/application/use-cases/list-appointments.use-case';
import { UpdateAppointmentStatusUseCase } from '../../../core/application/use-cases/update-appointment-status.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { Appointment } from '../../../core/domain/models/appointment';

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
          <h1>Performance da semana</h1>
          <p class="description">Acompanhe os principais indicadores e atue proativamente nos agendamentos.</p>
        </div>
        <button class="refresh" type="button" (click)="load()" [disabled]="loading()">Atualizar</button>
      </header>

      <div class="metrics">
        <app-metric-card label="Agendamentos" [value]="totalAppointments()" icon="🗓"></app-metric-card>
        <app-metric-card label="Concluídos" [value]="doneAppointments()" icon="✅"></app-metric-card>
        <app-metric-card label="Cancelados" [value]="cancelledAppointments()" icon="⚠️"></app-metric-card>
      </div>

      <section class="panel">
        <header>
          <div>
            <h2>Próximos atendimentos</h2>
            <p class="description">Altere o status conforme o progresso do atendimento.</p>
          </div>
        </header>
        <app-appointment-list [appointments]="appointments()" (change)="updateStatus($event)"></app-appointment-list>
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
        color: #38bdf8;
        margin-bottom: 0.75rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.75rem);
      }

      .description {
        color: #94a3b8;
        margin-top: 0.5rem;
      }

      .refresh {
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.6);
        color: inherit;
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        cursor: pointer;
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
        background: rgba(15, 23, 42, 0.75);
        border-radius: 2rem;
        padding: 2.5rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
      }

      .panel header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .panel h2 {
        margin: 0;
      }

      @media (max-width: 768px) {
        .panel {
          padding: 1.5rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly listAppointmentsUseCase = inject(ListAppointmentsUseCase);
  private readonly updateAppointmentStatusUseCase = inject(UpdateAppointmentStatusUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  readonly appointments = signal<Appointment[] | null>(null);
  readonly loading = signal(false);

  readonly totalAppointments = computed(() => this.appointments()?.length ?? 0);
  readonly doneAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'done').length
  );
  readonly cancelledAppointments = computed(
    () => (this.appointments() ?? []).filter((item: Appointment) => item.status === 'cancelled').length
  );

  ngOnInit(): void {
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

  updateStatus(event: { id: string; status: Appointment['status'] }): void {
    this.updateAppointmentStatusUseCase.execute(event.id, event.status).subscribe({
      next: (updated: Appointment) => {
        const current = this.appointments() ?? [];
        this.appointments.set(current.map((item: Appointment) => (item.id === updated.id ? updated : item)));
      }
    });
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }
}

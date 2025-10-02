import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ScheduleAppointmentUseCase } from '../../../core/application/use-cases/schedule-appointment.use-case';
import { ListAppointmentsUseCase } from '../../../core/application/use-cases/list-appointments.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { Appointment } from '../../../core/domain/models/appointment';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppHeaderComponent],
  template: `
    <app-header (logout)="logout()"></app-header>
    <section class="schedule">
      <header>
        <div>
          <p class="eyebrow">Agenda inteligente</p>
          <h1>Novo agendamento</h1>
          <p class="description">Organize horários com rapidez e garanta uma experiência premium para os tutores.</p>
        </div>
      </header>

      <div class="layout">
        <form [formGroup]="form" (ngSubmit)="schedule()" novalidate>
          <label>
            Pet
            <input type="text" formControlName="petName" placeholder="Thor" />
          </label>
          <label>
            Tutor
            <input type="text" formControlName="ownerName" placeholder="Carla Silva" />
          </label>
          <label>
            Serviço
            <input type="text" formControlName="service" placeholder="Banho &amp; hidratação" />
          </label>
          <label>
            Data e hora
            <input type="datetime-local" formControlName="scheduledAt" />
          </label>
          <button type="submit" [disabled]="form.invalid || creating()">{{ creating() ? 'Agendando...' : 'Agendar' }}</button>
        </form>

        <section class="list">
          <h2>Próximos agendamentos</h2>
          <div class="items" *ngIf="appointments()?.length; else empty">
            <article class="item" *ngFor="let appointment of appointments()">
              <div>
                <h3>{{ appointment.petName }} · {{ appointment.service }}</h3>
                <p>Tutor: {{ appointment.ownerName }}</p>
              </div>
              <span>{{ appointment.scheduledAt | date: 'dd/MM/yyyy HH:mm' }}</span>
            </article>
          </div>
          <ng-template #empty>
            <p class="empty">Nenhum agendamento encontrado.</p>
          </ng-template>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .schedule {
        padding: 2.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem;
        display: grid;
        gap: 2.5rem;
      }

      header {
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

      .description {
        color: #94a3b8;
        margin-top: 0.5rem;
      }

      .layout {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      form {
        background: rgba(15, 23, 42, 0.75);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      input {
        padding: 0.8rem 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.65);
        color: inherit;
      }

      button {
        margin-top: 0.5rem;
        padding: 0.85rem 1.5rem;
        border-radius: 9999px;
        border: none;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        color: #0f172a;
        font-weight: 600;
        cursor: pointer;
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .list {
        background: rgba(15, 23, 42, 0.45);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
      }

      .items {
        display: grid;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(15, 23, 42, 0.7);
        border-radius: 1.5rem;
        padding: 1.25rem 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .item h3 {
        margin: 0;
      }

      .item p {
        margin: 0.35rem 0 0 0;
        color: #94a3b8;
      }

      .item span {
        color: #38bdf8;
        font-weight: 600;
      }

      .empty {
        color: #94a3b8;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly scheduleAppointmentUseCase = inject(ScheduleAppointmentUseCase);
  private readonly listAppointmentsUseCase = inject(ListAppointmentsUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    petId: [''],
    petName: ['', Validators.required],
    ownerName: ['', Validators.required],
    service: ['', Validators.required],
    scheduledAt: ['', Validators.required]
  });

  readonly appointments = signal<Appointment[] | null>(null);
  readonly creating = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.listAppointmentsUseCase.execute().subscribe({
      next: (appointments: Appointment[]) => this.appointments.set(appointments),
      error: () => this.appointments.set([])
    });
  }

  schedule(): void {
    if (this.form.invalid) {
      return;
    }

    this.creating.set(true);
    const { petId, petName, ownerName, service, scheduledAt } = this.form.getRawValue();
    this.scheduleAppointmentUseCase
      .execute({ petId, petName, ownerName, service, scheduledAt })
      .subscribe({
        next: (appointment: Appointment) => {
          this.creating.set(false);
          this.form.reset();
          this.appointments.set([appointment, ...(this.appointments() ?? [])]);
        },
        error: () => {
          this.creating.set(false);
        }
      });
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }
}

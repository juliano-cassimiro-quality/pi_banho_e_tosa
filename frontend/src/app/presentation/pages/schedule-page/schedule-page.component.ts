import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ScheduleAppointmentUseCase } from '../../../core/application/use-cases/schedule-appointment.use-case';
import { ListAppointmentsUseCase } from '../../../core/application/use-cases/list-appointments.use-case';
import { ListPetsUseCase } from '../../../core/application/use-cases/list-pets.use-case';
import { ListAvailabilityUseCase } from '../../../core/application/use-cases/list-availability.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { LoadProfileUseCase } from '../../../core/application/use-cases/load-profile.use-case';
import { Appointment, serviceLabel, statusLabel as statusLabelFn } from '../../../core/domain/models/appointment';
import { Pet } from '../../../core/domain/models/pet';
import { User } from '../../../core/domain/models/user';
import { AvailableSlot } from '../../../core/domain/repositories/appointment.repository';

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
          <h1>Agendamentos integrados</h1>
          <p class="description">
            Selecione um pet, o serviço desejado e consulte horários sugeridos pelo endpoint <code>/appointments/availability</code>.
          </p>
        </div>
      </header>

      <div class="layout" *ngIf="user() as current">
        <form [formGroup]="form" (ngSubmit)="schedule()" novalidate [class.disabled]="form.disabled">
          <h2>Novo agendamento</h2>
          <p class="helper" *ngIf="form.disabled && current.role !== 'CLIENTE'">
            Apenas contas de cliente podem criar agendamentos. Utilize uma conta de cliente para habilitar o formulário.
          </p>
          <label>
            Pet
            <select formControlName="animalId">
              <option [ngValue]="null" disabled>Selecione um pet</option>
              <option *ngFor="let pet of pets()" [ngValue]="pet.id">{{ pet.nome }} ({{ pet.especie }})</option>
            </select>
          </label>
          <label>
            Serviço
            <select formControlName="tipoServico">
              <option value="BANHO">{{ serviceLabel('BANHO') }}</option>
              <option value="TOSA">{{ serviceLabel('TOSA') }}</option>
              <option value="BANHO_E_TOSA">{{ serviceLabel('BANHO_E_TOSA') }}</option>
            </select>
          </label>
          <div class="grid">
            <label>
              Data
              <input type="date" formControlName="data" />
            </label>
            <label>
              Horário
              <input type="time" formControlName="horario" />
            </label>
          </div>
          <label>
            Observações para o profissional
            <textarea
              rows="3"
              formControlName="observacoesCliente"
              placeholder="Cliente prefere tosa higiênica e banho morno"
            ></textarea>
          </label>
          <button type="submit" [disabled]="form.invalid || creating() || form.disabled">
            {{ creating() ? 'Agendando...' : 'Agendar' }}
          </button>

          <section class="availability" *ngIf="availableSlots()?.length">
            <h3>Horários sugeridos</h3>
            <p>Gerados pelo backend considerando capacidade e duração do serviço.</p>
            <div class="slots">
              <button type="button" *ngFor="let slot of availableSlots()" (click)="selectSlot(slot)">
                {{ slot.inicio | date: 'dd/MM HH:mm' }}
              </button>
            </div>
          </section>
        </form>

        <section class="list">
          <h2>Próximos agendamentos</h2>
          <div class="items" *ngIf="appointments()?.length; else empty">
            <article class="item" *ngFor="let appointment of appointments()">
              <div>
                <h3>{{ appointment.animal.nome }} · {{ serviceLabel(appointment.tipoServico) }}</h3>
                <p>Cliente: {{ appointment.cliente.nome }}</p>
                <p class="muted">{{ appointment.observacoesCliente || 'Sem observações' }}</p>
              </div>
              <div class="meta">
                <span class="status">{{ statusLabel(appointment.status) }}</span>
                <span>{{ appointment.dataHora | date: 'dd/MM/yyyy HH:mm' }}</span>
              </div>
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
        color: var(--color-accent-strong);
        margin-bottom: 0.75rem;
      }

      .description {
        color: var(--color-text-muted);
        margin-top: 0.5rem;
        max-width: 60ch;
      }

      .layout {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        align-items: start;
      }

      form {
        background: var(--color-surface);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid var(--color-border);
        display: grid;
        gap: 1.25rem;
        box-shadow: var(--shadow-lg);
      }

      form.disabled {
        opacity: 0.6;
      }

      h2 {
        margin: 0;
        font-size: 1.6rem;
        color: var(--color-heading);
      }

      .helper {
        margin: 0;
        color: #ca8a04;
        font-size: 0.85rem;
        background: rgba(202, 138, 4, 0.12);
        padding: 0.75rem 1rem;
        border-radius: 1rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      input,
      select,
      textarea {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid var(--color-border);
        background: var(--color-surface-elevated);
        color: var(--color-text);
        font-family: inherit;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input:focus,
      select:focus,
      textarea:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent);
      }

      textarea {
        resize: vertical;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      button[type='submit'] {
        margin-top: 0.5rem;
        padding: 0.95rem 1.5rem;
        border-radius: 1rem;
        border: none;
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-strong) 100%);
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-sm);
      }

      button[type='submit']:hover:not([disabled]) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      button[type='submit'][disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .availability {
        display: grid;
        gap: 0.75rem;
        border-top: 1px solid var(--color-border);
        padding-top: 1.25rem;
      }

      .slots {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .slots button {
        padding: 0.6rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }

      .slots button:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
        border-color: var(--color-accent);
        color: var(--color-accent-strong);
      }

      .list {
        background: var(--color-surface);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
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
        background: var(--color-surface-elevated);
        border-radius: 1.5rem;
        padding: 1.25rem 1.5rem;
        border: 1px solid var(--color-border);
        gap: 1rem;
      }

      .item h3 {
        margin: 0;
        color: var(--color-heading);
      }

      .item p {
        margin: 0.35rem 0 0;
        color: var(--color-text-muted);
      }

      .item .muted {
        font-size: 0.85rem;
      }

      .meta {
        display: grid;
        text-align: right;
        gap: 0.35rem;
        color: var(--color-text-muted);
      }

      .status {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-accent-strong);
      }

      .empty {
        color: var(--color-text-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulePageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly scheduleAppointmentUseCase = inject(ScheduleAppointmentUseCase);
  private readonly listAppointmentsUseCase = inject(ListAppointmentsUseCase);
  private readonly listPetsUseCase = inject(ListPetsUseCase);
  private readonly listAvailabilityUseCase = inject(ListAvailabilityUseCase);
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  private availabilitySubscription: Subscription | null = null;

  readonly form = this.fb.nonNullable.group({
    animalId: [null as number | null, Validators.required],
    tipoServico: ['BANHO', Validators.required],
    data: ['', Validators.required],
    horario: ['', Validators.required],
    observacoesCliente: ['']
  });

  readonly appointments = signal<Appointment[] | null>(null);
  readonly pets = signal<Pet[]>([]);
  readonly availableSlots = signal<AvailableSlot[] | null>(null);
  readonly creating = signal(false);
  readonly user = signal<User | null>(null);

  constructor() {
    effect(
      () => {
        const role = this.user()?.role;
        const date = this.form.controls.data.value;
        const tipoServico = this.form.controls.tipoServico.value as 'BANHO' | 'TOSA' | 'BANHO_E_TOSA';

        if (this.availabilitySubscription) {
          this.availabilitySubscription.unsubscribe();
          this.availabilitySubscription = null;
        }

        if (role !== 'CLIENTE' || !date || !tipoServico) {
          this.availableSlots.set(null);
          return;
        }

        this.availabilitySubscription = this.listAvailabilityUseCase.execute(date, tipoServico).subscribe({
          next: (slots: AvailableSlot[]) => this.availableSlots.set(slots),
          error: () => this.availableSlots.set([])
        });
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        const role = this.user()?.role;

        if (role === 'CLIENTE' && this.form.disabled) {
          this.form.enable({ emitEvent: false });
        } else if (role !== 'CLIENTE' && this.form.enabled) {
          this.form.disable({ emitEvent: false });
          this.availableSlots.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.loadProfileUseCase.execute().subscribe({
      next: (user: User) => this.user.set(user)
    });
    this.listPetsUseCase.execute().subscribe({
      next: (pets: Pet[]) => this.pets.set(pets),
      error: () => this.pets.set([])
    });
    this.load();
  }

  ngOnDestroy(): void {
    if (this.availabilitySubscription) {
      this.availabilitySubscription.unsubscribe();
    }
  }

  load(): void {
    this.listAppointmentsUseCase.execute().subscribe({
      next: (appointments: Appointment[]) => this.appointments.set(appointments),
      error: () => this.appointments.set([])
    });
  }

  schedule(): void {
    if (this.form.invalid || this.form.disabled) {
      return;
    }

    this.creating.set(true);
    const { animalId, tipoServico, data, horario, observacoesCliente } = this.form.getRawValue();
    this.scheduleAppointmentUseCase
      .execute({
        animalId: animalId!,
        tipoServico: tipoServico as 'BANHO' | 'TOSA' | 'BANHO_E_TOSA',
        data,
        horario,
        observacoesCliente
      })
      .subscribe({
        next: () => {
          this.creating.set(false);
          this.form.patchValue({ observacoesCliente: '' });
          this.load();
        },
        error: () => {
          this.creating.set(false);
        }
      });
  }

  selectSlot(slot: AvailableSlot): void {
    this.form.patchValue({
      data: slot.inicio.split('T')[0],
      horario: slot.inicio.split('T')[1].slice(0, 5)
    });
  }

  statusLabel(status: Appointment['status']): string {
    return statusLabelFn(status);
  }

  serviceLabel(service: Appointment['tipoServico']): string {
    return serviceLabel(service);
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.router.navigate(['/login']);
  }
}

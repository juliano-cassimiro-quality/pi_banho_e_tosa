import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ListPetsUseCase } from '../../../core/application/use-cases/list-pets.use-case';
import { CreatePetUseCase } from '../../../core/application/use-cases/create-pet.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { Pet } from '../../../core/domain/models/pet';

@Component({
  selector: 'app-pets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppHeaderComponent],
  template: `
    <app-header (logout)="logout()"></app-header>
    <section class="pets">
      <header>
        <div>
          <p class="eyebrow">Cadastro</p>
          <h1>Pets e tutores</h1>
          <p class="description">Mantenha os dados dos pets atualizados para personalizar o atendimento.</p>
        </div>
      </header>

      <div class="layout">
        <form [formGroup]="form" (ngSubmit)="create()" novalidate>
          <h2>Novo pet</h2>
          <label>
            Nome do pet
            <input type="text" formControlName="name" placeholder="Thor" />
          </label>
          <label>
            Espécie
            <input type="text" formControlName="type" placeholder="Cachorro" />
          </label>
          <label>
            Raça
            <input type="text" formControlName="breed" placeholder="Lhasa Apso" />
          </label>
          <label>
            Nome do tutor
            <input type="text" formControlName="ownerName" placeholder="Carla Silva" />
          </label>
          <button type="submit" [disabled]="form.invalid || creating()">{{ creating() ? 'Salvando...' : 'Cadastrar pet' }}</button>
        </form>

        <section class="list">
          <h2>Pets cadastrados</h2>
          <div class="cards" *ngIf="pets()?.length; else empty">
            <article class="card" *ngFor="let pet of pets()">
              <h3>{{ pet.name }}</h3>
              <p>{{ pet.type }} · {{ pet.breed || 'Sem raça definida' }}</p>
              <span>Tutor: {{ pet.ownerName }}</span>
            </article>
          </div>
          <ng-template #empty>
            <p class="empty">Cadastre um pet para começar.</p>
          </ng-template>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .pets {
        padding: 2.5rem clamp(1.5rem, 4vw, 3.5rem) 4rem;
        display: grid;
        gap: 2.5rem;
      }

      header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
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

      .cards {
        display: grid;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .card {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 1.5rem;
        padding: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .card h3 {
        margin: 0 0 0.5rem 0;
      }

      .card p {
        margin: 0;
        color: #94a3b8;
      }

      .card span {
        display: block;
        margin-top: 0.75rem;
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
export class PetsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly listPetsUseCase = inject(ListPetsUseCase);
  private readonly createPetUseCase = inject(CreatePetUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    breed: [''],
    ownerName: ['', Validators.required]
  });

  readonly pets = signal<Pet[] | null>(null);
  readonly creating = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.listPetsUseCase.execute().subscribe({
      next: pets => this.pets.set(pets),
      error: () => this.pets.set([])
    });
  }

  create(): void {
    if (this.form.invalid) {
      return;
    }

    this.creating.set(true);
    this.createPetUseCase.execute(this.form.getRawValue()).subscribe({
      next: pet => {
        this.creating.set(false);
        this.form.reset();
        this.pets.set([...(this.pets() ?? []), pet]);
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

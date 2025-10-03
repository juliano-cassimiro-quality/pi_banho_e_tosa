import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ListPetsUseCase } from '../../../core/application/use-cases/list-pets.use-case';
import { CreatePetUseCase } from '../../../core/application/use-cases/create-pet.use-case';
import { LogoutUseCase } from '../../../core/application/use-cases/logout.use-case';
import { LoadProfileUseCase } from '../../../core/application/use-cases/load-profile.use-case';
import { Pet } from '../../../core/domain/models/pet';
import { User } from '../../../core/domain/models/user';

@Component({
  selector: 'app-pets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppHeaderComponent],
  template: `
    <app-header (logout)="logout()"></app-header>
    <section class="pets">
      <header>
        <div>
          <p class="eyebrow">Cadastro centralizado</p>
          <h1>Pets conectados ao backend</h1>
          <p class="description">
            Consulte e cadastre animais com os mesmos campos do DTO <code>PetRequest</code> do Spring Boot.
          </p>
        </div>
      </header>

      <div class="layout" *ngIf="user() as current">
        <form
          [formGroup]="form"
          (ngSubmit)="create()"
          novalidate
          [class.disabled]="current.role !== 'CLIENTE'"
        >
          <h2>Novo pet</h2>
          <p class="helper" *ngIf="current.role !== 'CLIENTE'">
            Apenas clientes podem cadastrar pets. Acesse com uma conta de cliente para habilitar o formulário.
          </p>
          <div class="grid">
            <label>
              Nome
              <input type="text" formControlName="nome" placeholder="Thor" [disabled]="current.role !== 'CLIENTE'" />
            </label>
            <label>
              Espécie
              <input type="text" formControlName="especie" placeholder="Cachorro" [disabled]="current.role !== 'CLIENTE'" />
            </label>
            <label>
              Porte
              <select formControlName="porte" [disabled]="current.role !== 'CLIENTE'">
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </label>
            <label>
              Idade (anos)
              <input type="number" min="0" formControlName="idade" placeholder="3" [disabled]="current.role !== 'CLIENTE'" />
            </label>
          </div>
          <label>
            Observações de saúde
            <textarea
              rows="3"
              formControlName="observacoesSaude"
              placeholder="Alergia a produtos com perfume"
              [disabled]="current.role !== 'CLIENTE'"
            ></textarea>
          </label>
          <label>
            Preferências
            <textarea
              rows="2"
              formControlName="preferencias"
              placeholder="Banho com água morna e secador silencioso"
              [disabled]="current.role !== 'CLIENTE'"
            ></textarea>
          </label>
          <button type="submit" [disabled]="form.invalid || creating() || current.role !== 'CLIENTE'">
            {{ creating() ? 'Salvando...' : 'Cadastrar pet' }}
          </button>
        </form>

        <section class="list">
          <div class="list-header">
            <h2>Pets cadastrados</h2>
            <p class="hint">Sincronizados via <code>/pets</code> conforme o usuário autenticado.</p>
          </div>
          <div class="cards" *ngIf="pets()?.length; else empty">
            <article class="card" *ngFor="let pet of pets()">
              <header>
                <h3>{{ pet.nome }}</h3>
                <span>{{ pet.especie }} · {{ pet.porte }}</span>
              </header>
              <dl>
                <div>
                  <dt>Idade</dt>
                  <dd>{{ pet.idade ?? '—' }}</dd>
                </div>
                <div>
                  <dt>Saúde</dt>
                  <dd>{{ pet.observacoesSaude || 'Sem observações' }}</dd>
                </div>
                <div>
                  <dt>Preferências</dt>
                  <dd>{{ pet.preferencias || 'Sem preferências' }}</dd>
                </div>
              </dl>
            </article>
          </div>
          <ng-template #empty>
            <p class="empty">Nenhum pet cadastrado até o momento.</p>
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
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        align-items: start;
      }

      form {
        background: rgba(15, 23, 42, 0.85);
        border-radius: 2rem;
        padding: 2rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        display: grid;
        gap: 1.25rem;
      }

      form.disabled {
        opacity: 0.6;
      }

      h2 {
        margin: 0;
        font-size: 1.6rem;
      }

      .helper {
        margin: 0;
        color: #fbbf24;
        font-size: 0.85rem;
        background: rgba(251, 191, 36, 0.12);
        padding: 0.75rem 1rem;
        border-radius: 1rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      input,
      select,
      textarea {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.55);
        color: inherit;
        font-family: inherit;
      }

      textarea {
        resize: vertical;
      }

      button {
        margin-top: 0.5rem;
        padding: 0.95rem 1.5rem;
        border-radius: 1rem;
        border: none;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        color: #0f172a;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease;
      }

      button:hover:not([disabled]) {
        transform: translateY(-1px);
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
        display: grid;
        gap: 1.5rem;
      }

      .list-header h2 {
        margin: 0;
      }

      .hint {
        margin: 0;
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .cards {
        display: grid;
        gap: 1.25rem;
      }

      .card {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 1.75rem;
        padding: 1.75rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        display: grid;
        gap: 1.25rem;
      }

      .card header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card header span {
        color: #94a3b8;
      }

      dl {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    especie: ['', Validators.required],
    porte: ['PEQUENO', Validators.required],
    idade: [null as number | null],
    observacoesSaude: [''],
    preferencias: ['']
  });

  readonly pets = signal<Pet[] | null>(null);
  readonly creating = signal(false);
  readonly user = signal<User | null>(null);

  ngOnInit(): void {
    this.loadProfileUseCase.execute().subscribe({
      next: (user: User) => this.user.set(user)
    });
    this.load();
  }

  load(): void {
    this.listPetsUseCase.execute().subscribe({
      next: (pets: Pet[]) => this.pets.set(pets),
      error: () => this.pets.set([])
    });
  }

  create(): void {
    if (this.form.invalid || this.user()?.role !== 'CLIENTE') {
      return;
    }

    this.creating.set(true);
    const { nome, especie, porte, idade, observacoesSaude, preferencias } = this.form.getRawValue();
    this.createPetUseCase
      .execute({ nome, especie, porte, idade: idade ?? null, observacoesSaude, preferencias })
      .subscribe({
        next: (pet: Pet) => {
          this.creating.set(false);
          this.form.reset({
            nome: '',
            especie: '',
            porte: 'PEQUENO',
            idade: null,
            observacoesSaude: '',
            preferencias: ''
          });
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

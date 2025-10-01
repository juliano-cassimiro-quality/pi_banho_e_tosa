import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegisterUseCase } from '../../../core/application/use-cases/register.use-case';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth">
      <div class="card">
        <h1>Crie sua conta</h1>
        <p class="subtitle">Conecte sua equipe e ofereça uma experiência memorável aos tutores.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>
            Nome completo
            <input type="text" formControlName="name" placeholder="Luma Santos" />
          </label>
          <label>
            E-mail profissional
            <input type="email" formControlName="email" placeholder="contato@banhoetosa.com" />
          </label>
          <label>
            Senha
            <input type="password" formControlName="password" placeholder="Crie uma senha segura" />
          </label>
          <button type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'Criando...' : 'Criar conta' }}</button>
        </form>
        <p class="hint" *ngIf="error()">{{ error() }}</p>
        <p class="register">
          Já possui acesso?
          <a routerLink="/login">Entrar</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .auth {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
      }

      .card {
        width: min(480px, 100%);
        background: rgba(15, 23, 42, 0.85);
        border-radius: 1.75rem;
        padding: 3rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
      }

      h1 {
        margin: 0;
        font-size: 2rem;
      }

      .subtitle {
        color: #94a3b8;
        margin-bottom: 2rem;
      }

      form {
        display: grid;
        gap: 1.25rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      input {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.65);
        color: inherit;
      }

      button {
        margin-top: 0.5rem;
        padding: 0.9rem 1.5rem;
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

      .hint {
        color: #fca5a5;
        margin-top: 1rem;
        text-align: center;
      }

      .register {
        margin-top: 2rem;
        text-align: center;
        color: #94a3b8;
      }

      .register a {
        color: #38bdf8;
        margin-left: 0.35rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { name, email, password } = this.form.getRawValue();
    this.registerUseCase.execute(name, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível realizar o cadastro.');
      }
    });
  }
}

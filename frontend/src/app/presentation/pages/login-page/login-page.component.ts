import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LoginUseCase } from '../../../core/application/use-cases/login.use-case';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth">
      <div class="hero">
        <p class="pill">PI Banho &amp; Tosa</p>
        <h1>Seja bem-vindo de volta 🌿</h1>
        <p class="description">
          Acesse o painel verde e acompanhe disponibilidade da equipe, histórico de atendimento e métricas em tempo real,
          totalmente sincronizados com o backend.
        </p>
        <ul>
          <li>Autenticação JWT integrada</li>
          <li>Dashboard sustentável com indicadores chave</li>
          <li>Agenda inteligente com reagendamentos ágeis</li>
        </ul>
      </div>
      <div class="card">
        <h2>Entre na sua conta</h2>
        <p class="subtitle">Informe as credenciais cadastradas para continuar.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>
            E-mail
            <input type="email" formControlName="email" placeholder="profissional@banhoetosa.com" />
          </label>
          <label>
            Senha
            <input type="password" formControlName="senha" placeholder="••••••••" />
          </label>
          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <p class="hint" *ngIf="error()">{{ error() }}</p>
        <p class="register">
          Ainda não possui conta?
          <a routerLink="/cadastro">Criar cadastro</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .auth {
        min-height: calc(100vh - 120px);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: clamp(2rem, 5vw, 4rem);
        align-items: center;
        padding: clamp(2.5rem, 6vw, 5.5rem);
      }

      .hero {
        display: grid;
        gap: 1.25rem;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.4rem 1.2rem;
        border-radius: 999px;
        background: var(--color-accent-soft);
        color: var(--color-accent-strong);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.78rem;
        font-weight: 600;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.2rem, 4.5vw, 3.15rem);
        color: var(--color-heading);
      }

      .description {
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.65;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
        color: var(--color-text-muted);
        display: grid;
        gap: 0.5rem;
      }

      .card {
        background: var(--color-surface);
        border-radius: 1.75rem;
        padding: clamp(2rem, 5vw, 3.25rem);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        display: grid;
        gap: 1.5rem;
      }

      .card h2 {
        margin: 0;
        font-size: 1.85rem;
        color: var(--color-heading);
      }

      .subtitle {
        margin: 0;
        color: var(--color-text-muted);
      }

      form {
        display: grid;
        gap: 1.25rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.92rem;
        color: var(--color-text-muted);
      }

      input {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid var(--color-border);
        background: var(--color-surface-elevated);
        color: var(--color-text);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent);
      }

      button {
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

      button:hover:not([disabled]) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .hint {
        margin: 0;
        color: var(--color-danger);
      }

      .register {
        margin: 0;
        color: var(--color-text-muted);
      }

      .register a {
        color: var(--color-accent-strong);
        font-weight: 600;
      }

      @media (max-width: 800px) {
        .auth {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, senha } = this.form.getRawValue();
    this.loginUseCase.execute(email, senha).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Não foi possível autenticar. Verifique as credenciais.');
      }
    });
  }
}

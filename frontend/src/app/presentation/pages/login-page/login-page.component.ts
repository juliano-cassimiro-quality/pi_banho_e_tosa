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
        <h1>Bem-vindo de volta 👋</h1>
        <p class="description">
          Acompanhe agendamentos, disponibilidade da equipe e histórico de atendimento em um único painel conectado ao seu
          backend Java.
        </p>
        <ul>
          <li>Integração nativa com autenticação JWT</li>
          <li>Agenda inteligente com reagendamento rápido</li>
          <li>Relatórios de desempenho em tempo real</li>
        </ul>
      </div>
      <div class="card">
        <h2>Acesse sua conta</h2>
        <p class="subtitle">Use o e-mail cadastrado para visualizar a operação completa.</p>
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
        min-height: 100vh;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: clamp(2rem, 5vw, 4rem);
        align-items: center;
        padding: clamp(2rem, 6vw, 6rem);
      }

      .hero {
        display: grid;
        gap: 1.25rem;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 1rem;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.25rem, 4vw, 3.25rem);
      }

      .description {
        color: #cbd5f5;
        line-height: 1.6;
      }

      ul {
        margin: 0;
        padding-left: 1.25rem;
        color: #94a3b8;
        display: grid;
        gap: 0.5rem;
      }

      .card {
        background: rgba(15, 23, 42, 0.9);
        border-radius: 2rem;
        padding: clamp(2rem, 5vw, 3rem);
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 25px 60px rgba(15, 23, 42, 0.45);
        display: grid;
        gap: 1.5rem;
      }

      .card h2 {
        margin: 0;
        font-size: 1.75rem;
      }

      .subtitle {
        margin: 0;
        color: #94a3b8;
      }

      form {
        display: grid;
        gap: 1.25rem;
      }

      label {
        display: grid;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #e2e8f0;
      }

      input {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.65);
        color: inherit;
      }

      input:focus {
        outline: none;
        border-color: rgba(56, 189, 248, 0.75);
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
      }

      button {
        margin-top: 0.5rem;
        padding: 0.95rem 1.5rem;
        border-radius: 1rem;
        border: none;
        background: linear-gradient(135deg, #38bdf8, #6366f1);
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

      .hint {
        margin: 0;
        color: #fca5a5;
      }

      .register {
        margin: 0;
        color: #94a3b8;
      }

      .register a {
        color: #38bdf8;
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

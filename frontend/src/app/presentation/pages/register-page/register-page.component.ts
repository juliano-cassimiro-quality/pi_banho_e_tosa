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
    <section class="register">
      <div class="copy">
        <span class="tag">Para equipes modernas</span>
        <h1>Uma experiência completa para quem cuida com carinho.</h1>
        <p>
          Cadastre-se para sincronizar automaticamente com o backend Spring Boot: autenticação, cadastro de pets, agenda e
          notificações para clientes premium.
        </p>
        <div class="highlights">
          <article>
            <h3>Fluxos otimizados</h3>
            <p>Formulários dinâmicos alinhados com os DTOs da API (RegisterRequest, PetRequest, AgendamentoRequest).</p>
          </article>
          <article>
            <h3>UX pensada no dia a dia</h3>
            <p>Componentes responsivos e microinterações que valorizam cada etapa do atendimento.</p>
          </article>
        </div>
      </div>
      <div class="form-card">
        <h2>Crie sua conta</h2>
        <p class="subtitle">Preencha os dados abaixo para liberar o painel conectado.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>
            Nome completo
            <input type="text" formControlName="nome" placeholder="Luma Santos" />
          </label>
          <label>
            Telefone
            <input type="tel" formControlName="telefone" placeholder="(11) 99999-0000" />
          </label>
          <label>
            E-mail
            <input type="email" formControlName="email" placeholder="contato@banhoetosa.com" />
          </label>
          <label>
            Senha
            <input type="password" formControlName="senha" placeholder="Mínimo de 6 caracteres" />
          </label>
          <label>
            Confirmar senha
            <input type="password" formControlName="confirmarSenha" placeholder="Repita a senha" />
          </label>
          <button type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </form>
        <p class="hint" *ngIf="error()">{{ error() }}</p>
        <p class="access">
          Já possui login?
          <a routerLink="/login">Entrar</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .register {
        min-height: 100vh;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: clamp(2rem, 6vw, 4rem);
        align-items: center;
        padding: clamp(2.5rem, 6vw, 6rem);
      }

      .copy {
        display: grid;
        gap: 1.5rem;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 1rem;
        border-radius: 999px;
        background: rgba(129, 140, 248, 0.2);
        color: #c7d2fe;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.75rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.4rem, 4.5vw, 3.5rem);
        line-height: 1.15;
      }

      .copy > p {
        margin: 0;
        color: #cbd5f5;
        line-height: 1.7;
      }

      .highlights {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .highlights article {
        background: rgba(15, 23, 42, 0.5);
        border-radius: 1.5rem;
        padding: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
      }

      .highlights h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
      }

      .highlights p {
        margin: 0;
        color: #94a3b8;
      }

      .form-card {
        background: rgba(15, 23, 42, 0.92);
        border-radius: 2rem;
        padding: clamp(2rem, 5vw, 3.25rem);
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 30px 70px rgba(15, 23, 42, 0.45);
        display: grid;
        gap: 1.5rem;
      }

      .form-card h2 {
        margin: 0;
        font-size: 1.85rem;
      }

      .subtitle {
        margin: 0;
        color: #94a3b8;
      }

      form {
        display: grid;
        gap: 1.1rem;
      }

      label {
        display: grid;
        gap: 0.45rem;
        font-size: 0.9rem;
      }

      input {
        padding: 0.85rem 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.3);
        background: rgba(15, 23, 42, 0.65);
        color: inherit;
      }

      input:focus {
        outline: none;
        border-color: rgba(129, 140, 248, 0.8);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }

      button {
        margin-top: 0.75rem;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        border: none;
        background: linear-gradient(135deg, #6366f1, #38bdf8);
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

      .access {
        margin: 0;
        color: #94a3b8;
      }

      .access a {
        color: #38bdf8;
        font-weight: 600;
      }

      @media (max-width: 960px) {
        .register {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
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
    nome: ['', [Validators.required, Validators.minLength(3)]],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { senha, confirmarSenha } = this.form.getRawValue();
    if (senha !== confirmarSenha) {
      this.error.set('As senhas não conferem.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { nome, telefone, email } = this.form.getRawValue();
    this.registerUseCase.execute(nome, telefone, email, senha).subscribe({
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

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegisterUseCase } from '../../../core/application/use-cases/register.use-case';
import { ProfileAvatarService } from '../../services/profile-avatar.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="register">
      <div class="copy">
        <span class="tag">Para equipes modernas</span>
        <h1>
          Uma experiência verde para quem cuida com carinho
          <span>do primeiro agendamento ao pós-atendimento.</span>
        </h1>
        <p>
          Cadastre-se para liberar dashboards sustentáveis, fluxo de pets completo e agendamentos sincronizados com o backend
          Spring Boot.
        </p>
        <div class="highlights">
          <article>
            <h3>Fluxos otimizados</h3>
            <p>Formulários dinâmicos alinhados com os DTOs da API e microinterações pensadas no dia a dia.</p>
          </article>
          <article>
            <h3>Experiência personalizada</h3>
            <p>Adicione sua foto de perfil, escolha o modo de cor ideal e acompanhe tudo em tempo real.</p>
          </article>
        </div>
      </div>
      <div class="form-card">
        <h2>Crie sua conta</h2>
        <p class="subtitle">Preencha os dados abaixo para liberar o painel conectado.</p>

        <div class="avatar-upload">
          <label class="dropzone" [class.with-image]="avatar()" for="avatar-input">
            <input id="avatar-input" type="file" accept="image/*" (change)="onAvatarSelected($event)" />
            <ng-container *ngIf="avatar(); else placeholder">
              <img [src]="avatar()!" alt="Pré-visualização da foto de perfil" />
            </ng-container>
            <ng-template #placeholder>
              <span class="icon" aria-hidden="true">📸</span>
              <strong>Adicionar foto de perfil</strong>
              <span class="hint">PNG ou JPG até 2&nbsp;MB</span>
            </ng-template>
          </label>
          <button type="button" class="clear" *ngIf="avatar()" (click)="clearAvatar()">Remover foto</button>
          <p class="avatar-error" *ngIf="avatarError()">{{ avatarError() }}</p>
        </div>

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
          <div class="grid">
            <label>
              Senha
              <input type="password" formControlName="senha" placeholder="Mínimo de 6 caracteres" />
            </label>
            <label>
              Confirmar senha
              <input type="password" formControlName="confirmarSenha" placeholder="Repita a senha" />
            </label>
          </div>
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
        min-height: calc(100vh - 120px);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: clamp(2rem, 6vw, 4rem);
        align-items: start;
        padding: clamp(2.5rem, 6vw, 6rem);
      }

      .copy {
        display: grid;
        gap: 1.6rem;
        max-width: 620px;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 1.1rem;
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
        font-size: clamp(2.4rem, 4.5vw, 3.5rem);
        line-height: 1.15;
        color: var(--color-heading);
      }

      h1 span {
        display: block;
        font-size: clamp(1.6rem, 3.5vw, 2.1rem);
        color: var(--color-text-muted);
        font-weight: 500;
      }

      .copy > p {
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.7;
      }

      .highlights {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .highlights article {
        background: var(--color-surface);
        border-radius: 1.5rem;
        padding: 1.5rem;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
        display: grid;
        gap: 0.75rem;
      }

      .highlights h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-heading);
      }

      .highlights p {
        margin: 0;
        color: var(--color-text-muted);
      }

      .form-card {
        background: var(--color-surface);
        border-radius: 2rem;
        padding: clamp(2.25rem, 5vw, 3.5rem);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        display: grid;
        gap: 1.75rem;
      }

      .form-card h2 {
        margin: 0;
        font-size: 1.95rem;
        color: var(--color-heading);
      }

      .subtitle {
        margin: 0;
        color: var(--color-text-muted);
      }

      .avatar-upload {
        display: grid;
        gap: 0.75rem;
      }

      .dropzone {
        position: relative;
        display: grid;
        place-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        border-radius: 1.5rem;
        border: 1.5px dashed var(--color-border);
        background: var(--color-surface-elevated);
        color: var(--color-text-muted);
        text-align: center;
        cursor: pointer;
        transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      }

      .dropzone:hover {
        border-color: var(--color-accent);
        box-shadow: var(--shadow-sm);
        transform: translateY(-1px);
      }

      .dropzone input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }

      .dropzone.with-image {
        padding: 0;
        border-style: solid;
        overflow: hidden;
      }

      .dropzone.with-image img {
        width: 100%;
        height: 220px;
        object-fit: cover;
      }

      .dropzone strong {
        color: var(--color-heading);
      }

      .dropzone .icon {
        font-size: 2rem;
      }

      .avatar-upload .hint {
        font-size: 0.85rem;
        color: var(--color-text-muted);
      }

      .clear {
        justify-self: flex-start;
        padding: 0.45rem 1.1rem;
        border-radius: 999px;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text);
        font-weight: 600;
        cursor: pointer;
      }

      .avatar-error {
        margin: 0;
        color: var(--color-danger);
        font-size: 0.85rem;
      }

      form {
        display: grid;
        gap: 1.25rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 1rem;
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
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent);
      }

      button[type='submit'] {
        margin-top: 0.75rem;
        padding: 1rem 1.5rem;
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

      .hint {
        margin: 0;
        color: var(--color-danger);
      }

      .access {
        margin: 0;
        color: var(--color-text-muted);
      }

      .access a {
        color: var(--color-accent-strong);
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
  private readonly avatarService = inject(ProfileAvatarService);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly avatarError = signal<string | null>(null);
  readonly avatar = this.avatarService.avatar;

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

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.avatarError.set('Escolha uma imagem de até 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() ?? null;
      if (result) {
        this.avatarService.setAvatar(result);
        this.avatarError.set(null);
      }
    };
    reader.readAsDataURL(file);
  }

  clearAvatar(): void {
    this.avatarService.clear();
    this.avatarError.set(null);
  }
}

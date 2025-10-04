import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadProfileUseCase } from '../../../core/application/use-cases/load-profile.use-case';
import { User, roleLabel } from '../../../core/domain/models/user';
import { ProfileAvatarService } from '../../services/profile-avatar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="brand">
        <span class="logo" aria-hidden="true">🐾</span>
        <div>
          <strong>PI Banho &amp; Tosa</strong>
          <small>Painel sustentável conectado</small>
        </div>
      </div>
      <nav class="nav-links">
        <a routerLink="/app" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/app/pets" routerLinkActive="active">Pets</a>
        <a routerLink="/app/agendamentos" routerLinkActive="active">Agendamentos</a>
      </nav>
      <div class="profile" *ngIf="user() as current">
        <div class="avatar" [class.placeholder]="!avatar()">
          <ng-container *ngIf="avatar(); else initialsTemplate">
            <img [src]="avatar()!" [alt]="'Foto de ' + current.nome" />
          </ng-container>
          <ng-template #initialsTemplate>
            <span>{{ initials() }}</span>
          </ng-template>
        </div>
        <div class="info">
          <strong>{{ current.nome }}</strong>
          <span>{{ role() }}</span>
        </div>
        <button type="button" class="logout" (click)="logout.emit()">Sair</button>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 20;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 2rem;
        padding: 1.25rem clamp(1.5rem, 4vw, 3rem);
        background: color-mix(in srgb, var(--color-surface) 92%, transparent);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--color-border);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .logo {
        width: 40px;
        height: 40px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        background: var(--color-accent-soft);
        color: var(--color-accent-strong);
        font-size: 1.35rem;
      }

      .brand strong {
        display: block;
        font-size: 1.1rem;
        color: var(--color-heading);
      }

      .brand small {
        color: var(--color-text-muted);
        font-size: 0.8rem;
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
      }

      .nav-links a {
        color: var(--color-text-muted);
        font-weight: 500;
        letter-spacing: 0.01em;
        transition: color 0.2s ease;
      }

      .nav-links a.active,
      .nav-links a:hover {
        color: var(--color-accent-strong);
      }

      .profile {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .avatar {
        width: 44px;
        height: 44px;
        border-radius: 16px;
        overflow: hidden;
        border: 2px solid var(--color-accent);
        background: var(--color-surface-elevated);
        display: grid;
        place-items: center;
        font-weight: 600;
        color: var(--color-accent-strong);
      }

      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar.placeholder {
        border-color: var(--color-border);
        color: var(--color-text-muted);
      }

      .info {
        display: grid;
        gap: 0.2rem;
        color: var(--color-heading);
      }

      .info strong {
        font-size: 0.95rem;
      }

      .info span {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .logout {
        background: var(--color-accent-soft);
        border: 1px solid var(--color-accent);
        color: var(--color-accent-strong);
        padding: 0.6rem 1.25rem;
        border-radius: 9999px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-sm);
      }

      .logout:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      @media (max-width: 900px) {
        .header {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
          gap: 1rem;
        }

        .nav-links {
          flex-wrap: wrap;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private readonly loadProfileUseCase = inject(LoadProfileUseCase);
  private readonly avatarService = inject(ProfileAvatarService);
  private profileSubscription: Subscription | null = null;

  @Output() logout = new EventEmitter<void>();

  readonly user = signal<User | null>(null);
  readonly role = computed(() => (this.user() ? roleLabel(this.user()!.role) : ''));
  readonly avatar = this.avatarService.avatar;
  readonly initials = computed(() => (this.user() ? this.getInitials(this.user()!.nome) : '')); 

  ngOnInit(): void {
    this.profileSubscription = this.loadProfileUseCase.execute().subscribe({
      next: (user: User) => this.user.set(user)
    });
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('');
  }
}

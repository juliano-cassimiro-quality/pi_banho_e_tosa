import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadProfileUseCase } from '../../../core/application/use-cases/load-profile.use-case';
import { User, roleLabel } from '../../../core/domain/models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="brand">
        <span class="logo">🐾</span>
        <div>
          <strong>PI Banho &amp; Tosa</strong>
          <small>Frontend + Spring Boot</small>
        </div>
      </div>
      <nav class="nav-links">
        <a routerLink="/app" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/app/pets" routerLinkActive="active">Pets</a>
        <a routerLink="/app/agendamentos" routerLinkActive="active">Agendamentos</a>
      </nav>
      <div class="profile" *ngIf="user() as current">
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
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo {
        font-size: 1.85rem;
      }

      .brand strong {
        display: block;
        font-size: 1.1rem;
      }

      .brand small {
        color: #94a3b8;
        font-size: 0.8rem;
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
      }

      .nav-links a {
        color: #cbd5f5;
        font-weight: 500;
        letter-spacing: 0.01em;
        transition: color 0.2s ease;
      }

      .nav-links a.active,
      .nav-links a:hover {
        color: #38bdf8;
      }

      .profile {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .info {
        display: grid;
        gap: 0.2rem;
      }

      .info strong {
        font-size: 0.95rem;
      }

      .info span {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .logout {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;
        padding: 0.6rem 1.25rem;
        border-radius: 9999px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s ease, transform 0.15s ease;
      }

      .logout:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: translateY(-1px);
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
  private profileSubscription: Subscription | null = null;

  @Output() logout = new EventEmitter<void>();

  readonly user = signal<User | null>(null);
  readonly role = computed(() => (this.user() ? roleLabel(this.user()!.role) : ''));

  ngOnInit(): void {
    this.profileSubscription = this.loadProfileUseCase.execute().subscribe({
      next: (user: User) => this.user.set(user)
    });
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
  }
}

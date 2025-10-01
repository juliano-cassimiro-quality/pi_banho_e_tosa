import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="brand">
        <span class="logo">🐾</span>
        <div>
          <strong>Banho &amp; Tosa</strong>
          <small>Gestão premium</small>
        </div>
      </div>
      <nav class="nav-links">
        <a routerLink="/app" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/app/pets" routerLinkActive="active">Pets</a>
        <a routerLink="/app/agendamentos" routerLinkActive="active">Agendamentos</a>
      </nav>
      <button type="button" class="logout" (click)="logout.emit()">Sair</button>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 2rem;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo {
        font-size: 1.75rem;
      }

      .brand strong {
        display: block;
        font-size: 1.1rem;
      }

      .brand small {
        color: #94a3b8;
        font-size: 0.75rem;
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
      }

      .nav-links a {
        color: #cbd5f5;
        font-weight: 500;
        letter-spacing: 0.01em;
      }

      .nav-links a.active {
        color: #38bdf8;
      }

      .logout {
        background: #ef4444;
        border: none;
        color: #fff;
        padding: 0.6rem 1.25rem;
        border-radius: 9999px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s ease;
      }

      .logout:hover {
        background: #dc2626;
      }

      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          gap: 1rem;
        }

        .nav-links {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    `
  ]
})
export class AppHeaderComponent {
  @Output() logout = new EventEmitter<void>();
}

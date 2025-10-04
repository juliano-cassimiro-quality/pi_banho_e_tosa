import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const THEME_STORAGE_KEY = 'pi-theme-preference';

type Theme = 'light' | 'dark';

function detectInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="top-toolbar" role="banner">
      <div class="identity">
        <span class="logo" aria-hidden="true">🐶</span>
        <div>
          <strong>PI Banho &amp; Tosa</strong>
          <span>Gestão verde conectada ao seu backend</span>
        </div>
      </div>
      <button type="button" class="theme-switch" (click)="toggleTheme()" [attr.aria-label]="themeLabel">
        <span class="icon" aria-hidden="true">{{ theme() === 'light' ? '🌞' : '🌙' }}</span>
        <span>{{ theme() === 'light' ? 'Modo claro' : 'Modo escuro' }}</span>
      </button>
    </div>
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: var(--color-background);
        color: var(--color-text);
      }

      .top-toolbar {
        position: sticky;
        top: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 1rem clamp(1rem, 4vw, 2.5rem);
        background: color-mix(in srgb, var(--color-surface) 82%, transparent);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--color-border);
      }

      .identity {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        color: var(--color-heading);
      }

      .identity strong {
        display: block;
        font-size: 1.05rem;
      }

      .identity span {
        display: block;
        font-size: 0.8rem;
        color: var(--color-text-muted);
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

      .theme-switch {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.55rem 1.1rem;
        border-radius: 999px;
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        color: var(--color-text);
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-sm);
      }

      .theme-switch:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      .theme-switch .icon {
        font-size: 1.2rem;
      }

      .app-shell {
        min-height: calc(100vh - 72px);
        background: radial-gradient(circle at 10% -10%, var(--color-accent-soft), transparent 55%),
          radial-gradient(circle at 90% 0, color-mix(in srgb, var(--color-accent-soft) 75%, transparent), transparent 60%),
          var(--color-background);
      }

      @media (max-width: 640px) {
        .top-toolbar {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .app-shell {
          min-height: calc(100vh - 136px);
        }
      }
    `
  ]
})
export class AppComponent {
  readonly theme = signal<Theme>(detectInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.classList.add(`theme-${current}`);
        document.body.style.background = 'var(--color-background)';
        document.body.style.color = 'var(--color-text)';
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, current);
      }
    });
  }

  get themeLabel(): string {
    return this.theme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';
  }

  toggleTheme(): void {
    this.theme.update((current: Theme) => (current === 'light' ? 'dark' : 'light'));
  }
}

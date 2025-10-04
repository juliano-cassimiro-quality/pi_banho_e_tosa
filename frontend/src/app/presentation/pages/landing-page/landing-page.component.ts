import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="landing">
      <div class="hero">
        <span class="badge">Experiência verde conectada</span>
        <h1>
          Gestão sustentável para banho &amp; tosa
          <span>do agendamento ao carinho final.</span>
        </h1>
        <p class="lead">
          Simplifique rotinas, acompanhe indicadores em tempo real e ofereça um atendimento acolhedor com a plataforma que
          conversa diretamente com o seu backend Spring Boot.
        </p>
        <div class="cta">
          <a routerLink="/cadastro" class="primary">Criar conta gratuita</a>
          <a routerLink="/login" class="ghost">Já tenho acesso</a>
        </div>
        <dl class="highlights">
          <div>
            <dt>Agenda inteligente</dt>
            <dd>Horários otimizados, confirmações automáticas e reagendamentos em um clique.</dd>
          </div>
          <div>
            <dt>Experiência premium</dt>
            <dd>Fluxos pensados para equipes que valorizam cuidado, agilidade e relacionamento.</dd>
          </div>
          <div>
            <dt>Insights em tempo real</dt>
            <dd>Painéis verdes com métricas de performance alinhadas ao seu negócio.</dd>
          </div>
        </dl>
      </div>
      <aside class="preview" aria-label="Pré-visualização do painel">
        <div class="dashboard-card">
          <header>
            <span class="pill">Hoje</span>
            <strong>Agenda sustentável</strong>
            <p>Três atendimentos confirmados e duas vagas livres para otimizar sua operação.</p>
          </header>
          <ul>
            <li>
              <span class="icon">🐾</span>
              <div>
                <strong>Thor</strong>
                <span>Banho &amp; hidratação às 09:30</span>
              </div>
            </li>
            <li>
              <span class="icon">✂️</span>
              <div>
                <strong>Luna</strong>
                <span>Tosa completa às 11:00</span>
              </div>
            </li>
            <li>
              <span class="icon">🌿</span>
              <div>
                <strong>Dica eco</strong>
                <span>Reduza o consumo trocando toalhas por ecofibra.</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  `,
  styles: [
    `
      .landing {
        min-height: calc(100vh - 120px);
        padding: clamp(2.5rem, 6vw, 6rem) clamp(1.5rem, 6vw, 6rem) clamp(3rem, 8vw, 7rem);
        display: grid;
        gap: clamp(2rem, 4vw, 5rem);
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        align-items: center;
      }

      .hero {
        display: grid;
        gap: 1.5rem;
        max-width: 620px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 1.1rem;
        border-radius: 999px;
        background: var(--color-accent-soft);
        color: var(--color-accent-strong);
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 600;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.6rem, 5vw, 3.75rem);
        line-height: 1.08;
        color: var(--color-heading);
      }

      h1 span {
        display: block;
        font-size: clamp(1.7rem, 4vw, 2.25rem);
        color: var(--color-text-muted);
        font-weight: 500;
      }

      .lead {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-text-muted);
        line-height: 1.7;
      }

      .cta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .cta a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.95rem 1.85rem;
        border-radius: 999px;
        font-weight: 600;
        letter-spacing: 0.02em;
        transition: transform 0.15s ease, box-shadow 0.2s ease;
      }

      .cta a:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
      }

      .cta .primary {
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-strong) 100%);
        color: #ffffff;
      }

      .cta .ghost {
        background: var(--color-surface);
        color: var(--color-text);
        border: 1px solid var(--color-border);
      }

      .highlights {
        display: grid;
        gap: 1.25rem;
        margin: 1.5rem 0 0;
      }

      .highlights div {
        padding: 1.25rem 1.5rem;
        border-radius: 1.5rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
        display: grid;
        gap: 0.35rem;
      }

      .highlights dt {
        margin: 0;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-muted);
      }

      .highlights dd {
        margin: 0;
        font-size: 1rem;
        color: var(--color-text);
        line-height: 1.6;
      }

      .preview {
        display: flex;
        justify-content: center;
      }

      .dashboard-card {
        width: min(420px, 100%);
        padding: 2.25rem;
        border-radius: 2rem;
        background: linear-gradient(160deg, color-mix(in srgb, var(--color-accent-soft) 65%, transparent) 0%,
            var(--color-surface) 55%);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        display: grid;
        gap: 1.5rem;
      }

      .dashboard-card header {
        display: grid;
        gap: 0.75rem;
      }

      .pill {
        justify-self: flex-start;
        padding: 0.35rem 0.9rem;
        border-radius: 999px;
        background: var(--color-surface-elevated);
        color: var(--color-text-muted);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .dashboard-card strong {
        font-size: 1.45rem;
        color: var(--color-heading);
      }

      .dashboard-card p {
        margin: 0;
        color: var(--color-text-muted);
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
      }

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-radius: 1.5rem;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-border);
      }

      li strong {
        display: block;
        color: var(--color-heading);
      }

      li span {
        display: block;
        color: var(--color-text-muted);
        font-size: 0.9rem;
      }

      .icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        background: var(--color-accent-soft);
        color: var(--color-accent-strong);
        font-size: 1.4rem;
      }

      @media (max-width: 960px) {
        .landing {
          grid-template-columns: 1fr;
          text-align: left;
        }

        .preview {
          justify-content: flex-start;
        }
      }
    `
  ]
})
export class LandingPageComponent {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="landing">
      <div class="content">
        <p class="tag">Gestão 360° para banho &amp; tosa</p>
        <h1>Agende, acompanhe e encante seus clientes.</h1>
        <p class="description">
          Plataforma completa com dashboards de desempenho, cadastros de pets e agendamentos inteligentes para o seu centro de
          estética animal.
        </p>
        <div class="actions">
          <a routerLink="/login">Entrar</a>
          <a routerLink="/cadastro" class="secondary">Começar agora</a>
        </div>
      </div>
      <aside class="preview">
        <div class="glass">
          <p class="glass-title">Painel inteligente</p>
          <ul>
            <li>Resumo financeiro em tempo real</li>
            <li>Controle de agenda otimizado</li>
            <li>Alertas para clientes VIP</li>
          </ul>
        </div>
      </aside>
    </section>
  `,
  styles: [
    `
      .landing {
        min-height: 100vh;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        align-items: center;
        gap: 3rem;
        padding: 4rem clamp(1.5rem, 5vw, 5rem);
      }

      .content h1 {
        font-size: clamp(2.5rem, 5vw, 3.75rem);
        margin-bottom: 1rem;
        line-height: 1.1;
      }

      .tag {
        display: inline-block;
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        margin-bottom: 1.5rem;
      }

      .description {
        color: #94a3b8;
        font-size: 1.05rem;
        max-width: 36ch;
      }

      .actions {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .actions a {
        padding: 0.8rem 1.75rem;
        border-radius: 9999px;
        font-weight: 600;
        letter-spacing: 0.02em;
        background: #38bdf8;
        color: #0f172a;
      }

      .actions .secondary {
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.4);
        color: #e2e8f0;
      }

      .preview {
        display: flex;
        justify-content: center;
      }

      .glass {
        width: min(360px, 90%);
        padding: 2.5rem;
        border-radius: 2rem;
        background: linear-gradient(145deg, rgba(56, 189, 248, 0.18), rgba(15, 23, 42, 0.8));
        border: 1px solid rgba(148, 163, 184, 0.35);
        box-shadow: 0 20px 80px rgba(15, 23, 42, 0.35);
      }

      .glass-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.75rem;
        color: #e2e8f0;
      }

      ul li::before {
        content: '✔';
        margin-right: 0.5rem;
        color: #38bdf8;
      }
    `
  ]
})
export class LandingPageComponent {}

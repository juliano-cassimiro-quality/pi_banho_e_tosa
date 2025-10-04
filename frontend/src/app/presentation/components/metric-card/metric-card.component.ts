import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="card">
      <div class="icon">{{ icon }}</div>
      <div>
        <p class="label">{{ label }}</p>
        <strong class="value">{{ value }}</strong>
      </div>
    </article>
  `,
  styles: [
    `
      .card {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--color-surface);
        border-radius: 1.25rem;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
        align-items: center;
      }

      .icon {
        width: 52px;
        height: 52px;
        border-radius: 18px;
        background: var(--color-accent-soft);
        color: var(--color-accent-strong);
        display: grid;
        place-items: center;
        font-size: 1.6rem;
      }

      .label {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .value {
        font-size: 1.85rem;
        display: block;
        margin-top: 0.35rem;
        color: var(--color-heading);
      }
    `
  ]
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '📈';
}

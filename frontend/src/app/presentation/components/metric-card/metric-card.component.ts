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
        background: rgba(30, 41, 59, 0.9);
        border-radius: 1.25rem;
        border: 1px solid rgba(148, 163, 184, 0.15);
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
      }

      .icon {
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        display: grid;
        place-items: center;
        font-size: 1.5rem;
      }

      .label {
        margin: 0;
        color: #94a3b8;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .value {
        font-size: 1.75rem;
        display: block;
        margin-top: 0.25rem;
      }
    `
  ]
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '📈';
}

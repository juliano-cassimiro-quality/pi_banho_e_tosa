import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      :host, .app-shell {
        display: block;
        min-height: 100vh;
        background: #0f172a;
        color: #f8fafc;
        font-family: 'Inter', sans-serif;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    `
  ]
})
export class AppComponent {}

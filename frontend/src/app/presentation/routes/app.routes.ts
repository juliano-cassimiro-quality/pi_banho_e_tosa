import { Routes } from '@angular/router';

import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { PetsPageComponent } from '../pages/pets-page/pets-page.component';
import { SchedulePageComponent } from '../pages/schedule-page/schedule-page.component';
import { authGuard } from './auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'cadastro', component: RegisterPageComponent },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'pets', component: PetsPageComponent },
      { path: 'agendamentos', component: SchedulePageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

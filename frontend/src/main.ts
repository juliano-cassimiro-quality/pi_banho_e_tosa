import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/presentation/routes/app.routes';
import { authInterceptor } from './app/infrastructure/http/auth.interceptor';
import { provideEnvironment } from './app/core/domain/environment.provider';
import { environment } from './environments/environment';
import { AUTH_HTTP_REPOSITORY_PROVIDER } from './app/infrastructure/http/auth.http.repository';
import { PET_HTTP_REPOSITORY_PROVIDER } from './app/infrastructure/http/pet.http.repository';
import { APPOINTMENT_HTTP_REPOSITORY_PROVIDER } from './app/infrastructure/http/appointment.http.repository';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideEnvironment(environment),
    AUTH_HTTP_REPOSITORY_PROVIDER,
    PET_HTTP_REPOSITORY_PROVIDER,
    APPOINTMENT_HTTP_REPOSITORY_PROVIDER
  ]
}).catch((err: unknown) => console.error(err));

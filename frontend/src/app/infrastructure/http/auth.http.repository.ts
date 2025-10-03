import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { AUTH_REPOSITORY, AuthRepository } from '../../core/domain/repositories/auth.repository';
import { User } from '../../core/domain/models/user';
import { ENVIRONMENT } from '../../core/domain/environment.provider';
import { TokenStorageService } from '../storage/token-storage.service';

interface AuthResponse {
  token: string;
  usuario: User;
}

@Injectable({ providedIn: 'root' })
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);
  private readonly storage = inject(TokenStorageService);

  login(email: string, senha: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.env.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap((response: AuthResponse) => this.storage.save(response.token)),
        map((response: AuthResponse) => ({ ...response.usuario, token: response.token }))
      );
  }

  register(nome: string, telefone: string, email: string, senha: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.env.apiUrl}/auth/register`, { nome, telefone, email, senha })
      .pipe(
        tap((response: AuthResponse) => this.storage.save(response.token)),
        map((response: AuthResponse) => ({ ...response.usuario, token: response.token }))
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.env.apiUrl}/usuarios/me`);
  }

  logout(): void {
    this.storage.clear();
  }
}

export const AUTH_HTTP_REPOSITORY_PROVIDER = {
  provide: AUTH_REPOSITORY,
  useExisting: AuthHttpRepository
};

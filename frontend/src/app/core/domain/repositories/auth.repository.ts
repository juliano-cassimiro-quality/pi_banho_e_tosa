import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

export interface AuthRepository {
  login(email: string, senha: string): Observable<User>;
  register(nome: string, telefone: string, email: string, senha: string): Observable<User>;
  getProfile(): Observable<User>;
  logout(): void;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');

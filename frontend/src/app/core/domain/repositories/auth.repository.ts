import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

export interface AuthRepository {
  login(email: string, password: string): Observable<User>;
  register(name: string, email: string, password: string): Observable<User>;
  getProfile(): Observable<User>;
  logout(): void;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(email: string, password: string): Observable<User> {
    return this.repository.login(email, password);
  }
}

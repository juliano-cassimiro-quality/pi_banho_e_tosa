import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(name: string, email: string, password: string): Observable<User> {
    return this.repository.register(name, email, password);
  }
}

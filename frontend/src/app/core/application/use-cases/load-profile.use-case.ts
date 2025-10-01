import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoadProfileUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): Observable<User> {
    return this.repository.getProfile();
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../../domain/models/pet';
import { PET_REPOSITORY } from '../../domain/repositories/pet.repository';

@Injectable({ providedIn: 'root' })
export class ListPetsUseCase {
  private readonly repository = inject(PET_REPOSITORY);

  execute(tutorId?: number): Observable<Pet[]> {
    return this.repository.list(tutorId);
  }
}

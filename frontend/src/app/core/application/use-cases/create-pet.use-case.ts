import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../../domain/models/pet';
import { CreatePetPayload, PET_REPOSITORY } from '../../domain/repositories/pet.repository';

@Injectable({ providedIn: 'root' })
export class CreatePetUseCase {
  private readonly repository = inject(PET_REPOSITORY);

  execute(pet: CreatePetPayload): Observable<Pet> {
    return this.repository.create(pet);
  }
}

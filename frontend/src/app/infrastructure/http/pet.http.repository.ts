import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pet } from '../../core/domain/models/pet';
import { PET_REPOSITORY, PetRepository } from '../../core/domain/repositories/pet.repository';
import { ENVIRONMENT } from '../../core/domain/environment.provider';

@Injectable({ providedIn: 'root' })
export class PetHttpRepository implements PetRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  list(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.env.apiUrl}/pets`);
  }

  create(pet: Omit<Pet, 'id'>): Observable<Pet> {
    return this.http.post<Pet>(`${this.env.apiUrl}/pets`, pet);
  }
}

export const PET_HTTP_REPOSITORY_PROVIDER = {
  provide: PET_REPOSITORY,
  useExisting: PetHttpRepository
};

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pet } from '../../core/domain/models/pet';
import { CreatePetPayload, PET_REPOSITORY, PetRepository } from '../../core/domain/repositories/pet.repository';
import { ENVIRONMENT } from '../../core/domain/environment.provider';

@Injectable({ providedIn: 'root' })
export class PetHttpRepository implements PetRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  list(tutorId?: number): Observable<Pet[]> {
    const params = tutorId ? { tutorId } : undefined;
    return this.http.get<Pet[]>(`${this.env.apiUrl}/pets`, { params });
  }

  create(pet: CreatePetPayload): Observable<Pet> {
    const body = {
      nome: pet.nome,
      especie: pet.especie,
      porte: pet.porte,
      idade: pet.idade ?? null,
      observacoesSaude: pet.observacoesSaude ?? null,
      preferencias: pet.preferencias ?? null
    };
    return this.http.post<Pet>(`${this.env.apiUrl}/pets`, body);
  }
}

export const PET_HTTP_REPOSITORY_PROVIDER = {
  provide: PET_REPOSITORY,
  useExisting: PetHttpRepository
};

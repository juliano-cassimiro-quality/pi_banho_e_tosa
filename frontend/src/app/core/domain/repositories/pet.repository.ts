import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet';

export interface CreatePetPayload {
  nome: string;
  especie: string;
  porte: string;
  idade?: number | null;
  observacoesSaude?: string | null;
  preferencias?: string | null;
}

export interface PetRepository {
  list(tutorId?: number): Observable<Pet[]>;
  create(pet: CreatePetPayload): Observable<Pet>;
}

export const PET_REPOSITORY = new InjectionToken<PetRepository>('PET_REPOSITORY');

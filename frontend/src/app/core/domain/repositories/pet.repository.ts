import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet';

export interface PetRepository {
  list(): Observable<Pet[]>;
  create(pet: Omit<Pet, 'id'>): Observable<Pet>;
}

export const PET_REPOSITORY = new InjectionToken<PetRepository>('PET_REPOSITORY');

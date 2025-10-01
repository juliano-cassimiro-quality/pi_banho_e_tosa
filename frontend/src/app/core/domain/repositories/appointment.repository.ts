import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

export interface AppointmentRepository {
  list(): Observable<Appointment[]>;
  schedule(input: Omit<Appointment, 'id' | 'status'>): Observable<Appointment>;
  updateStatus(id: string, status: Appointment['status']): Observable<Appointment>;
}

export const APPOINTMENT_REPOSITORY = new InjectionToken<AppointmentRepository>('APPOINTMENT_REPOSITORY');

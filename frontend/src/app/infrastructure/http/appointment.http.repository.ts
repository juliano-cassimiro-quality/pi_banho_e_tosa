import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appointment } from '../../core/domain/models/appointment';
import { APPOINTMENT_REPOSITORY, AppointmentRepository } from '../../core/domain/repositories/appointment.repository';
import { ENVIRONMENT } from '../../core/domain/environment.provider';

@Injectable({ providedIn: 'root' })
export class AppointmentHttpRepository implements AppointmentRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  list(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.env.apiUrl}/appointments`);
  }

  schedule(input: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.env.apiUrl}/appointments`, input);
  }

  updateStatus(id: string, status: Appointment['status']): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.env.apiUrl}/appointments/${id}`, { status });
  }
}

export const APPOINTMENT_HTTP_REPOSITORY_PROVIDER = {
  provide: APPOINTMENT_REPOSITORY,
  useExisting: AppointmentHttpRepository
};

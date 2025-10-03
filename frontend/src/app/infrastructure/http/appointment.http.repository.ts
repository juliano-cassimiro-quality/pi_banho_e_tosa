import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Appointment } from '../../core/domain/models/appointment';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepository,
  AvailableSlot,
  CancelAppointmentPayload,
  CompleteAppointmentPayload,
  RescheduleAppointmentPayload,
  ScheduleAppointmentPayload
} from '../../core/domain/repositories/appointment.repository';
import { ENVIRONMENT } from '../../core/domain/environment.provider';

@Injectable({ providedIn: 'root' })
export class AppointmentHttpRepository implements AppointmentRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  list(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.env.apiUrl}/appointments`);
  }

  schedule(input: ScheduleAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.env.apiUrl}/appointments`, input);
  }

  reschedule(input: RescheduleAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.env.apiUrl}/appointments/${input.id}/reschedule`, {
      novaDataHora: input.novaDataHora
    });
  }

  complete(input: CompleteAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.env.apiUrl}/appointments/${input.id}/complete`, {
      observacoesProfissional: input.observacoesProfissional ?? null
    });
  }

  cancel(input: CancelAppointmentPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.env.apiUrl}/appointments/${input.id}/cancel`, {
      motivo: input.motivo
    });
  }

  availability(date: string, tipoServico: ScheduleAppointmentPayload['tipoServico']): Observable<AvailableSlot[]> {
    const params = new HttpParams().set('date', date).set('serviceType', tipoServico);
    return this.http.get<AvailableSlot[]>(`${this.env.apiUrl}/appointments/availability`, { params });
  }
}

export const APPOINTMENT_HTTP_REPOSITORY_PROVIDER = {
  provide: APPOINTMENT_REPOSITORY,
  useExisting: AppointmentHttpRepository
};

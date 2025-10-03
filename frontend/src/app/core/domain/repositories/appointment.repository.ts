import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment, ServicoTipo } from '../models/appointment';

export interface ScheduleAppointmentPayload {
  animalId: number;
  tipoServico: ServicoTipo;
  dataHora: string;
  observacoesCliente?: string | null;
}

export interface RescheduleAppointmentPayload {
  id: number;
  novaDataHora: string;
}

export interface CompleteAppointmentPayload {
  id: number;
  observacoesProfissional?: string | null;
}

export interface CancelAppointmentPayload {
  id: number;
  motivo: string;
}

export interface AvailableSlot {
  inicio: string;
  fim: string;
}

export interface AppointmentRepository {
  list(): Observable<Appointment[]>;
  schedule(input: ScheduleAppointmentPayload): Observable<Appointment>;
  reschedule(input: RescheduleAppointmentPayload): Observable<Appointment>;
  complete(input: CompleteAppointmentPayload): Observable<Appointment>;
  cancel(input: CancelAppointmentPayload): Observable<Appointment>;
  availability(date: string, tipoServico: ServicoTipo): Observable<AvailableSlot[]>;
}

export const APPOINTMENT_REPOSITORY = new InjectionToken<AppointmentRepository>('APPOINTMENT_REPOSITORY');

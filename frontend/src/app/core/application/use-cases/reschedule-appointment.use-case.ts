import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY, RescheduleAppointmentPayload } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class RescheduleAppointmentUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(payload: RescheduleAppointmentPayload): Observable<Appointment> {
    return this.repository.reschedule(payload);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY, CompleteAppointmentPayload } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class CompleteAppointmentUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(payload: CompleteAppointmentPayload): Observable<Appointment> {
    return this.repository.complete(payload);
  }
}

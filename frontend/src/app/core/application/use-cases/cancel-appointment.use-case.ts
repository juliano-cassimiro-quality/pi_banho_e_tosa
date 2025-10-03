import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY, CancelAppointmentPayload } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class CancelAppointmentUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(payload: CancelAppointmentPayload): Observable<Appointment> {
    return this.repository.cancel(payload);
  }
}

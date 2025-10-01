import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class UpdateAppointmentStatusUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(id: string, status: Appointment['status']): Observable<Appointment> {
    return this.repository.updateStatus(id, status);
  }
}

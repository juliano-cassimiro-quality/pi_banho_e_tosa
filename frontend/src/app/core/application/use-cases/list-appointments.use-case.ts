import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class ListAppointmentsUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(): Observable<Appointment[]> {
    return this.repository.list();
  }
}

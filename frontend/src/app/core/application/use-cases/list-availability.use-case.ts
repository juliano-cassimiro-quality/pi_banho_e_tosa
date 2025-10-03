import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicoTipo } from '../../domain/models/appointment';
import { APPOINTMENT_REPOSITORY, AvailableSlot } from '../../domain/repositories/appointment.repository';

@Injectable({ providedIn: 'root' })
export class ListAvailabilityUseCase {
  private readonly repository = inject(APPOINTMENT_REPOSITORY);

  execute(date: string, tipoServico: ServicoTipo): Observable<AvailableSlot[]> {
    return this.repository.availability(date, tipoServico);
  }
}

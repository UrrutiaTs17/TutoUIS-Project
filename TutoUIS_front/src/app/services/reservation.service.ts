import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private mockReservations = [
    { id: 1, titulo: 'Tutoría Cálculo I', fecha: '2025-10-21', hora: '14:00', solicitante: '2182197', solicitante_nombre: 'Juan Pérez', descripcion: 'Necesito ayuda con límites' },
    { id: 2, titulo: 'Tutoría Programación', fecha: '2025-10-22', hora: '10:00', solicitante: '2182198', solicitante_nombre: 'María García', descripcion: 'Dudas en arrays' },
    { id: 3, titulo: 'Tutoría Física', fecha: '2025-10-23', hora: '16:00', solicitante: '2182199', solicitante_nombre: 'Carlos López', descripcion: 'Problemas en cinemática' }
  ];

  constructor() {}

  getPendingReservations(): Observable<any[]> {
    return of(this.mockReservations).pipe(
      catchError(err => {
        console.error('Error fetching reservations', err);
        return of([]);
      })
    );
  }

  acceptReservation(id: number) {
    return of({ success: true });
  }

  rejectReservation(id: number) {
    return of({ success: true });
  }
}

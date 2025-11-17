import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Reserva {
  idReserva: number;
  idDisponibilidad: number;
  idEstudiante: number;
  idEstado: number;
  estadoReserva: {
    idEstado: number;
    nombre: string;
    descripcion: string;
  };
  observaciones: string | null;
  fechaCreacion: string | null;
  fechaCancelacion: string | null;
  razonCancelacion: string | null;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly API_URL = 'http://localhost:8080/api/reservas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllReservations(): Observable<Reserva[]> {
    console.log('ReservationService - Solicitando lista de reservas...');
    const headers = this.authService.getAuthHeaders();
    console.log('ReservationService - Headers:', headers.keys());
    console.log('ReservationService - URL:', `${this.API_URL}/list`);

    return this.http.get<Reserva[]>(`${this.API_URL}/list`, { headers }).pipe(
      tap((reservas: Reserva[]) => {
        console.log('ReservationService - Respuesta recibida:', reservas.length, 'reservas');
      }),
      catchError((error: any) => {
        console.error('ReservationService - Error en getAllReservations:', error);
        return throwError(() => error);
      })
    );
  }

  getPendingReservations(): Observable<any[]> {
    // Método antiguo - mantener por compatibilidad
    const mockReservations = [
      { id: 1, titulo: 'Tutoría Cálculo I', fecha: '2025-10-21', hora: '14:00', solicitante: '2182197', solicitante_nombre: 'Juan Pérez', descripcion: 'Necesito ayuda con límites' },
      { id: 2, titulo: 'Tutoría Programación', fecha: '2025-10-22', hora: '10:00', solicitante: '2182198', solicitante_nombre: 'María García', descripcion: 'Dudas en arrays' },
      { id: 3, titulo: 'Tutoría Física', fecha: '2025-10-23', hora: '16:00', solicitante: '2182199', solicitante_nombre: 'Carlos López', descripcion: 'Problemas en cinemática' }
    ];
    return of(mockReservations).pipe(
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

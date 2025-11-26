import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Reserva {
  idReserva: number;
  idDisponibilidad: number;
  disponibilidadHoraInicio?: string; // Horario de inicio de la disponibilidad
  disponibilidadHoraFin?: string;    // Horario de fin de la disponibilidad
  fechaDisponibilidad?: string; // Fecha de la disponibilidad
  diaSemana?: string; // Día de la semana de la disponibilidad
  idEstudiante: number;
  nombreEstudiante?: string; // Nombre completo del estudiante
  idEstado: number;
  nombreEstado?: string; // Nombre del estado de la reserva
  observaciones: string | null;
  fechaCreacion: string | null;
  fechaCancelacion: string | null;
  razonCancelacion: string | null;
  horaInicio: string; // Format: "HH:mm:ss"
  horaFin: string;    // Format: "HH:mm:ss"
  nombreAsignatura?: string; // Nombre de la asignatura de la tutoría
  nombreTutor?: string; // Nombre completo del tutor
  modalidad?: string; // Modalidad: Presencial o Virtual
  meetLink?: string; // Enlace de Google Meet (solo para modalidad Virtual)
  lugar?: string; // Lugar de la reserva
}

export interface CreateReservaDto {
  idDisponibilidad: number;
  idEstudiante: number;
  observaciones?: string;
  horaInicio: string; // Format: "HH:mm:ss"
  horaFin: string;    // Format: "HH:mm:ss"
  modalidad: 'Presencial' | 'Virtual';
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

  /**
   * Obtiene las reservas de HOY del tutor (día actual)
   * @param idTutor ID del tutor
   */
  getTutorTodayReservations(idTutor: number): Observable<Reserva[]> {
    console.log('ReservationService - Obteniendo reservas de HOY para tutor:', idTutor);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Reserva[]>(`${this.API_URL}/tutor/${idTutor}/hoy`, { headers }).pipe(
      tap(reservas => console.log('ReservationService - Reservas de hoy recibidas:', reservas.length)),
      catchError(err => {
        console.error('ReservationService - Error obteniendo reservas de hoy:', err);
        return of([]);
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

  /**
   * Crea una nueva reserva de tutoría
   * @param reservaData Datos de la reserva (horaInicio y horaFin deben ser formato "HH:mm:ss")
   * @returns Observable con la reserva creada
   */
  createReservation(reservaData: CreateReservaDto): Observable<Reserva> {
    console.log('ReservationService - Creando reserva:', reservaData);
    const headers = this.authService.getAuthHeaders();
    
    return this.http.post<Reserva>(`${this.API_URL}/`, reservaData, { headers }).pipe(
      tap((reserva: Reserva) => {
        console.log('ReservationService - Reserva creada exitosamente:', reserva);
      })
      // NO transformar el error - dejarlo pasar tal cual para que el componente lo maneje
    );
  }

  /**
   * Obtiene todas las reservas de un usuario específico
   * @param idEstudiante ID del estudiante
   * @returns Observable con array de reservas
   */
  getUserReservations(idEstudiante: number): Observable<Reserva[]> {
    console.log('ReservationService - Obteniendo reservas del usuario:', idEstudiante);
    const headers = this.authService.getAuthHeaders();
    
    return this.http.get<Reserva[]>(`${this.API_URL}/estudiante/${idEstudiante}`, { headers }).pipe(
      tap((reservas: Reserva[]) => {
        console.log('ReservationService - Reservas del usuario obtenidas:', reservas.length);
      })
    );
  }

  /**
   * Cancela una reserva existente
   * @param id ID de la reserva
   * @param razon Razón de la cancelación
   * @returns Observable con la reserva cancelada
   */
  cancelReservation(id: number, razon: string): Observable<Reserva> {
    console.log('ReservationService - Cancelando reserva:', id);
    const headers = this.authService.getAuthHeaders();
    
    // Enviar como 'razonCancelacion' para que coincida con el backend
    return this.http.put<Reserva>(`${this.API_URL}/${id}/cancelar`, { razonCancelacion: razon }, { headers }).pipe(
      tap((reserva: Reserva) => {
        console.log('ReservationService - Reserva cancelada exitosamente:', reserva);
      })
    );
  }

  /**
   * Elimina una reserva permanentemente
   * @param id ID de la reserva
   * @returns Observable vacío
   */
  deleteReservation(id: number): Observable<void> {
    console.log('ReservationService - Eliminando reserva:', id);
    const headers = this.authService.getAuthHeaders();
    
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers }).pipe(
      tap(() => {
        console.log('ReservationService - Reserva eliminada exitosamente');
      })
    );
  }

  /**
   * Obtiene todas las reservas de una disponibilidad específica
   * @param idDisponibilidad ID de la disponibilidad
   * @returns Observable con array de reservas
   */
  getReservationsByDisponibilidad(idDisponibilidad: number): Observable<Reserva[]> {
    console.log('ReservationService - Obteniendo reservas por disponibilidad:', idDisponibilidad);
    const headers = this.authService.getAuthHeaders();
    
    return this.http.get<Reserva[]>(`${this.API_URL}/disponibilidad/${idDisponibilidad}`, { headers }).pipe(
      tap((reservas: Reserva[]) => {
        console.log('ReservationService - Reservas obtenidas:', reservas.length);
      }),
      catchError((error: any) => {
        console.error('ReservationService - Error obteniendo reservas por disponibilidad:', error);
        return of([]);
      })
    );
  }
}

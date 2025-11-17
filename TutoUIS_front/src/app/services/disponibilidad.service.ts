import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces para disponibilidades
export interface Disponibilidad {
  idDisponibilidad: number;
  idTutoria: number;
  diaSemana: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  aforo: number;
  aforoMaximo: number;
  aforoDisponible: number;
  idEstado: number;
  razonCancelacion?: string;
  fechaCreacion?: string;
}

export interface DisponibilidadConTutoria extends Disponibilidad {
  nombreTutoria?: string;
  nombreTutor?: string;
  nombreCarrera?: string;
  descripcionTutoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {
  private readonly apiUrl = 'http://localhost:8080/api/disponibilidades';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene todas las disponibilidades
   */
  getAllDisponibilidades(): Observable<Disponibilidad[]> {
    console.log('🌐 DisponibilidadService: Llamando a GET', `${this.apiUrl}/list`);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}/list`, { headers }).pipe(
      tap(disponibilidades => console.log('✅ DisponibilidadService: Respuesta recibida:', disponibilidades.length, 'disponibilidades')),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidades:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene una disponibilidad por ID
   */
  getDisponibilidadById(id: number): Observable<Disponibilidad> {
    console.log('🌐 DisponibilidadService: Obteniendo disponibilidad ID:', id);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(disp => console.log('✅ DisponibilidadService: Disponibilidad obtenida:', disp)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidad:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene disponibilidades por tutoría
   */
  getDisponibilidadesByTutoria(idTutoria: number): Observable<Disponibilidad[]> {
    console.log('🌐 DisponibilidadService: Obteniendo disponibilidades para tutoría ID:', idTutoria);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}/tutoria/${idTutoria}`, { headers }).pipe(
      tap(disponibilidades => console.log('✅ DisponibilidadService: Disponibilidades obtenidas:', disponibilidades.length)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidades por tutoría:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene disponibilidades por día de la semana
   */
  getDisponibilidadesByDia(diaSemana: string): Observable<Disponibilidad[]> {
    console.log('🌐 DisponibilidadService: Obteniendo disponibilidades para día:', diaSemana);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}/dia/${diaSemana}`, { headers }).pipe(
      tap(disponibilidades => console.log('✅ DisponibilidadService: Disponibilidades obtenidas:', disponibilidades.length)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidades por día:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene disponibilidades activas
   */
  getDisponibilidadesActivas(): Observable<Disponibilidad[]> {
    console.log('🌐 DisponibilidadService: Obteniendo disponibilidades activas');
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}/activas`, { headers }).pipe(
      tap(disponibilidades => console.log('✅ DisponibilidadService: Disponibilidades activas obtenidas:', disponibilidades.length)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidades activas:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene disponibilidades por tutoría y estado
   */
  getDisponibilidadesByTutoriaYEstado(idTutoria: number, idEstado: number): Observable<Disponibilidad[]> {
    console.log('🌐 DisponibilidadService: Obteniendo disponibilidades para tutoría ID:', idTutoria, 'y estado:', idEstado);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Disponibilidad[]>(`${this.apiUrl}/tutoria/${idTutoria}/estado/${idEstado}`, { headers }).pipe(
      tap(disponibilidades => console.log('✅ DisponibilidadService: Disponibilidades obtenidas:', disponibilidades.length)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al obtener disponibilidades:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crea una nueva disponibilidad
   */
  createDisponibilidad(disponibilidad: Partial<Disponibilidad>): Observable<Disponibilidad> {
    console.log('🌐 DisponibilidadService: Creando disponibilidad:', disponibilidad);
    const headers = this.authService.getAuthHeaders();
    return this.http.post<Disponibilidad>(`${this.apiUrl}/`, disponibilidad, { headers }).pipe(
      tap(disp => console.log('✅ DisponibilidadService: Disponibilidad creada:', disp)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al crear disponibilidad:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza una disponibilidad existente
   */
  updateDisponibilidad(id: number, disponibilidad: Partial<Disponibilidad>): Observable<Disponibilidad> {
    console.log('🌐 DisponibilidadService: Actualizando disponibilidad ID:', id, disponibilidad);
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Disponibilidad>(`${this.apiUrl}/${id}`, disponibilidad, { headers }).pipe(
      tap(disp => console.log('✅ DisponibilidadService: Disponibilidad actualizada:', disp)),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al actualizar disponibilidad:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Elimina una disponibilidad
   */
  deleteDisponibilidad(id: number): Observable<void> {
    console.log('🌐 DisponibilidadService: Eliminando disponibilidad ID:', id);
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => console.log('✅ DisponibilidadService: Disponibilidad eliminada')),
      catchError(error => {
        console.error('❌ DisponibilidadService: Error al eliminar disponibilidad:', error);
        return throwError(() => error);
      })
    );
  }
}

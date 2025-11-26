import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ActividadReciente {
  tipo: string; // "USUARIO", "TUTORIA", "RESERVA"
  descripcion: string;
  usuario: string;
  fecha: string;
  icono: string;
  badge: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private readonly API_URL = 'http://localhost:8080/api/actividad';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene las últimas actividades del sistema
   */
  obtenerActividadReciente(limite: number = 10): Observable<ActividadReciente[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<ActividadReciente[]>(`${this.API_URL}/reciente?limite=${limite}`, { headers });
  }
}

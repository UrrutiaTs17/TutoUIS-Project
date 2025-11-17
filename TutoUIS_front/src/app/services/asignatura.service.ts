import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Asignatura {
  idAsignatura?: number; // Como lo maneja el backend
  id_asignatura?: number; // Forma alternativa
  nombre: string;
  facultad: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private readonly apiUrl = 'http://localhost:8080/api/asignaturas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllAsignaturas(): Observable<Asignatura[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Asignatura[]>(`${this.apiUrl}/list`, { headers }).pipe(
      tap(list => console.log('AsignaturaService: asignaturas cargadas', list.length)),
      catchError(err => {
        console.error('Error cargando asignaturas', err);
        return throwError(() => err);
      })
    );
  }
}

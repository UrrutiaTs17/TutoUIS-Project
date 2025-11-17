import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces para tutorías
export interface Tutoria {
  idTutoria: number;
  idTutor: number;
  idCarrera: number;
  nombre: string;
  descripcion?: string;
  capacidadMaxima: number;
  ubicacion?: string;
  estado: number;
  nombreTutor?: string;
  nombreCarrera?: string;
}

export interface CreateTutoriaDto {
  idTutor: number;
  idCarrera: number; // Se envía para compatibilidad actual frontend (backend puede ignorarlo)
  idAsignatura: number; // Nueva relación con asignatura
  modalidad: string; // Presencial | Virtual | Híbrida
  nombre: string; // Nombre lógico interno (si backend no lo usa, puede ignorarse)
  descripcion?: string;
  capacidadMaxima: number;
  ubicacion?: string; // Mapeado a "lugar" en backend si existe
}

export interface UpdateTutoriaDto {
  nombre?: string;
  descripcion?: string;
  capacidadMaxima?: number;
  ubicacion?: string;
  estado?: number;
}

export interface Carrera {
  idCarrera?: number;      // Para compatibilidad con frontend
  id_carrera?: number;     // Como viene del backend
  nombre: string;
  codigo?: string;
  facultad?: string;
  escuela?: string;
  descripcion?: string;
}

export interface TutorInfo {
  idUsuario?: number;      // Para compatibilidad con frontend
  id_usuario?: number;     // Como viene del backend
  nombre: string;
  apellido: string;
  codigo: string;
  especialidad?: string;
  id_rol?: number;         // Como viene del backend
  idRol?: number;          // Para compatibilidad con frontend
  correo?: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutoriaService {
  private readonly apiUrl = 'http://localhost:8080/api/tutorias';  // Sin tilde
  private readonly carreraUrl = 'http://localhost:8080/api/carreras';
  private readonly tutorUrl = 'http://localhost:8080/api/usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene todas las tutorías
   */
  getAllTutorias(): Observable<Tutoria[]> {
    console.log('🌐 TutoriaService: Llamando a GET', `${this.apiUrl}/list`);
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Tutoria[]>(`${this.apiUrl}/list`, { headers }).pipe(
      tap(tutorias => console.log('✅ TutoriaService: Respuesta recibida:', tutorias.length, 'tutorías')),
      catchError(error => {
        console.error('❌ TutoriaService: Error al obtener tutorías:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene una tutoría por ID
   */
  getTutoriaById(id: number): Observable<Tutoria> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Tutoria>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Obtiene tutorías de un tutor específico
   */
  getTutoriasByTutor(idTutor: number): Observable<Tutoria[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Tutoria[]>(`${this.apiUrl}/tutor/${idTutor}`, { headers });
  }

  /**
   * Obtiene tutorías de una carrera específica
   */
  getTutoriasByCarrera(idCarrera: number): Observable<Tutoria[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Tutoria[]>(`${this.apiUrl}/carrera/${idCarrera}`, { headers });
  }

  /**
   * Crea una nueva tutoría
   */
  createTutoria(tutoria: CreateTutoriaDto): Observable<Tutoria> {
    const headers = this.authService.getAuthHeaders();
    // Adaptar payload a modelo backend (lugar en vez de ubicacion, omitir campos no existentes)
    const payload: any = {
      idTutor: tutoria.idTutor,
      idAsignatura: tutoria.idAsignatura,
      modalidad: tutoria.modalidad,
      lugar: tutoria.ubicacion, // mapeo
      descripcion: tutoria.descripcion,
      capacidadMaxima: tutoria.capacidadMaxima,
      estado: 1
    };
    return this.http.post<Tutoria>(`${this.apiUrl}/`, payload, { headers });
  }

  /**
   * Actualiza una tutoría existente
   */
  updateTutoria(id: number, tutoria: UpdateTutoriaDto): Observable<Tutoria> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<Tutoria>(`${this.apiUrl}/${id}`, tutoria, { headers });
  }

  /**
   * Elimina una tutoría
   */
  deleteTutoria(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Obtiene todas las carreras (para el dropdown)
   */
  getAllCarreras(): Observable<Carrera[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Carrera[]>(`${this.carreraUrl}/list`, { headers });
  }

  /**
   * Obtiene tutores disponibles (usuarios con rol Tutor)
   */
  getTutores(): Observable<TutorInfo[]> {
    // Buscar usuarios con rol 2 (Tutor)
    const headers = this.authService.getAuthHeaders();
    return this.http.get<TutorInfo[]>(`${this.tutorUrl}/list`, { headers });
  }

  /**
   * Obtiene un tutor por ID
   */
  getTutorById(id: number): Observable<TutorInfo> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<TutorInfo>(`${this.tutorUrl}/${id}`, { headers });
  }
}

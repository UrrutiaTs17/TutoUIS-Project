import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  idCarrera: number;
  nombre: string;
  descripcion?: string;
  capacidadMaxima: number;
  ubicacion?: string;
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
  private apiUrl = 'http://localhost:8080/api/tutorias';  // Sin tilde
  private carreraUrl = 'http://localhost:8080/api/carreras';
  private tutorUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las tutorías
   */
  getAllTutorias(): Observable<Tutoria[]> {
    console.log('🌐 TutoriaService: Llamando a GET', `${this.apiUrl}/list`);
    return this.http.get<Tutoria[]>(`${this.apiUrl}/list`);
  }

  /**
   * Obtiene una tutoría por ID
   */
  getTutoriaById(id: number): Observable<Tutoria> {
    return this.http.get<Tutoria>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene tutorías de un tutor específico
   */
  getTutoriasByTutor(idTutor: number): Observable<Tutoria[]> {
    return this.http.get<Tutoria[]>(`${this.apiUrl}/tutor/${idTutor}`);
  }

  /**
   * Obtiene tutorías de una carrera específica
   */
  getTutoriasByCarrera(idCarrera: number): Observable<Tutoria[]> {
    return this.http.get<Tutoria[]>(`${this.apiUrl}/carrera/${idCarrera}`);
  }

  /**
   * Crea una nueva tutoría
   */
  createTutoria(tutoria: CreateTutoriaDto): Observable<Tutoria> {
    return this.http.post<Tutoria>(`${this.apiUrl}/`, tutoria);
  }

  /**
   * Actualiza una tutoría existente
   */
  updateTutoria(id: number, tutoria: UpdateTutoriaDto): Observable<Tutoria> {
    return this.http.put<Tutoria>(`${this.apiUrl}/${id}`, tutoria);
  }

  /**
   * Elimina una tutoría
   */
  deleteTutoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las carreras (para el dropdown)
   */
  getAllCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.carreraUrl}/list`);
  }

  /**
   * Obtiene tutores disponibles (usuarios con rol Tutor)
   */
  getTutores(): Observable<TutorInfo[]> {
    // Buscar usuarios con rol 2 (Tutor)
    return this.http.get<TutorInfo[]>(`${this.tutorUrl}/list`);
  }

  /**
   * Obtiene un tutor por ID
   */
  getTutorById(id: number): Observable<TutorInfo> {
    return this.http.get<TutorInfo>(`${this.tutorUrl}/${id}`);
  }
}

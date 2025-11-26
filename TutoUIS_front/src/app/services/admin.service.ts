import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  telefono: string;
  id_rol: number;
  nombreRol?: string; // Campo opcional con el nombre del rol
  id_carrera: number;
  activo: boolean;
  bloqueado: boolean;
  fecha_creacion: string;
  fecha_ultima_modificacion: string;
}

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/api/usuarios';
  private readonly ROLES_API_URL = 'http://localhost:8080/api/roles';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  /**
   * Obtiene todos los usuarios del sistema
   */
  getAllUsers(): Observable<Usuario[]> {
    console.log('AdminService - Solicitando lista de usuarios...');
    const headers = this.getAuthHeaders();
    console.log('AdminService - Headers:', headers.keys());
    console.log('AdminService - URL:', `${this.API_URL}/list`);
    
    return this.http.get<Usuario[]>(`${this.API_URL}/list`, { headers })
      .pipe(
        tap((users: Usuario[]) => {
          console.log('AdminService - Respuesta recibida:', users.length, 'usuarios');
        }),
        catchError((error: any) => {
          console.error('AdminService - Error en getAllUsers:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id: number): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    return this.http.get<Usuario>(`${this.API_URL}/${id}`, { headers });
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(userData: Partial<Usuario>): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    return this.http.post<Usuario>(`${this.API_URL}/register`, userData, { headers });
  }

  /**
   * Actualiza un usuario existente
   */
  updateUser(id: number, userData: Partial<Usuario>): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, userData, { headers });
  }

  /**
   * Elimina un usuario
   */
  deleteUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers });
  }

  /**
   * Bloquea un usuario
   */
  blockUser(id: number): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    // Usar el endpoint PUT con el campo bloqueado ya que PATCH puede no estar configurado
    return this.getUserById(id).pipe(
      switchMap((usuario: Usuario) => {
        usuario.bloqueado = true;
        return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario, { headers });
      })
    );
  }

  /**
   * Desbloquea un usuario
   */
  unblockUser(id: number): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    // Usar el endpoint PUT con el campo bloqueado ya que PATCH puede no estar configurado
    return this.getUserById(id).pipe(
      switchMap((usuario: Usuario) => {
        usuario.bloqueado = false;
        return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario, { headers });
      })
    );
  }

  /**
   * Activa un usuario
   */
  activateUser(id: number): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/activate`, {}, { headers });
  }

  /**
   * Desactiva un usuario
   */
  deactivateUser(id: number): Observable<Usuario> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/deactivate`, {}, { headers });
  }

  /**
   * Obtiene todos los roles del sistema
   */
  getAllRoles(): Observable<Rol[]> {
    console.log('AdminService - Solicitando lista de roles...');
    const headers = this.getAuthHeaders();
    
    return this.http.get<Rol[]>(this.ROLES_API_URL, { headers })
      .pipe(
        tap((roles: Rol[]) => {
          console.log('AdminService - Roles recibidos:', roles);
        }),
        catchError((error: any) => {
          console.error('AdminService - Error al obtener roles:', error);
          return throwError(() => error);
        })
      );
  }
}

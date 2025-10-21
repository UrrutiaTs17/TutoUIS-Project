import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface LoginRequest {
  codigo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  codigo: string;
  id_usuario: number;
}

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  telefono: string;
  id_rol: number;
  id_carrera: number;
  activo: boolean;
  bloqueado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private readonly API_USUARIOS_URL = 'http://localhost:8080/api/usuarios';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly PROFILE_KEY = 'user_profile';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Solo verificar el token si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUserData(response);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    console.log('AuthService - Cerrando sesión...');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.PROFILE_KEY);
      console.log('AuthService - LocalStorage limpiado');
    }
    this.isAuthenticatedSubject.next(false);
    console.log('AuthService - Usuario desautenticado');
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUserData(): LoginResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUserData(userData: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.API_USUARIOS_URL}/profile`, { headers })
      .pipe(
        tap(response => {
          // Cachear el perfil para acceso rápido
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.PROFILE_KEY, JSON.stringify(response));
          }
        })
      );
  }

  getCachedProfile(): any {
    if (isPlatformBrowser(this.platformId)) {
      const cachedProfile = localStorage.getItem(this.PROFILE_KEY);
      return cachedProfile ? JSON.parse(cachedProfile) : null;
    }
    return null;
  }

  updateUserProfile(profileData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.API_USUARIOS_URL}/profile`, profileData, { headers })
      .pipe(
        tap(response => {
          // Actualizar datos locales si es necesario
          const userData = this.getUserData();
          if (userData) {
            this.setUserData(userData);
          }
        })
      );
  }

  // Método para verificar si el usuario es administrador
  isAdmin(): boolean {
    const profile = this.getCachedProfile();
    if (profile && profile.id_rol !== undefined) {
      // Asumiendo que id_rol = 1 es administrador
      return profile.id_rol === 1;
    }
    return false;
  }

  // Método para obtener el rol del usuario
  getUserRole(): number | null {
    const profile = this.getCachedProfile();
    return profile?.id_rol ?? null;
  }
}

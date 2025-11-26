import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface Carrera {
  idCarrera: number;
  nombre: string;
  descripcion: string;
  codigo: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private readonly API_URL = 'http://localhost:8080/api/carreras';
  private readonly CARRERAS_KEY = 'carreras_cache';
  
  private carrerasSubject = new BehaviorSubject<Carrera[]>([]);
  public carreras$ = this.carrerasSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadCachedCarreras();
  }

  private loadCachedCarreras(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cachedCarreras = localStorage.getItem(this.CARRERAS_KEY);
      if (cachedCarreras) {
        try {
          const carreras = JSON.parse(cachedCarreras);
          this.carrerasSubject.next(carreras);
        } catch (error) {
          console.warn('Error al cargar carreras desde caché:', error);
        }
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) 
      ? localStorage.getItem('auth_token') 
      : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCarreras(): Observable<Carrera[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Carrera[]>(`${this.API_URL}/list`, { headers })
      .pipe(
        tap(carreras => {
          // Cachear las carreras
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.CARRERAS_KEY, JSON.stringify(carreras));
          }
          this.carrerasSubject.next(carreras);
        })
      );
  }

  getCarreraById(id: number): Observable<Carrera> {
    const headers = this.getAuthHeaders();
    return this.http.get<Carrera>(`${this.API_URL}/list/${id}`, { headers });
  }

  getCarreraNameById(id: number): string {
    const carreras = this.carrerasSubject.value;
    const carrera = carreras.find(c => c.idCarrera === id);
    return carrera ? carrera.nombre : `Carrera #${id}`;
  }

  getCachedCarreras(): Carrera[] {
    return this.carrerasSubject.value;
  }
}


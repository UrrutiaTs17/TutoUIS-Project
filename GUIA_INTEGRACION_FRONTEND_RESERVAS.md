# Guía de Integración Frontend - Reservaciones

Este documento proporciona ejemplos de cómo integrar el CRUD de reservaciones en la aplicación Angular.

## 1. Servicio Angular (reservation.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  idReserva: number;
  idDisponibilidad: number;
  idEstudiante: number;
  idEstado: number;
  nombreEstado: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaCancelacion?: string;
  razonCancelacion?: string;
}

export interface CreateReservaDto {
  idDisponibilidad: number;
  idEstudiante: number;
  observaciones?: string;
}

export interface UpdateReservaDto {
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }

  // Obtener todas las reservas
  getAllReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/list`);
  }

  // Obtener reserva por ID
  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  // Obtener mis reservas (del estudiante autenticado)
  getMisReservas(idEstudiante: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/estudiante/${idEstudiante}`);
  }

  // Obtener reservas activas
  getReservasActivas(idEstudiante: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/estudiante/${idEstudiante}/activas`);
  }

  // Obtener reservas por disponibilidad
  getReservasPorDisponibilidad(idDisponibilidad: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/disponibilidad/${idDisponibilidad}`);
  }

  // Crear nueva reserva
  crearReserva(dto: CreateReservaDto): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.apiUrl}/`, dto);
  }

  // Actualizar observaciones de reserva
  actualizarReserva(id: number, dto: UpdateReservaDto): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, dto);
  }

  // Cancelar reserva
  cancelarReserva(id: number, razonCancelacion: string): Observable<Reserva> {
    return this.http.put<Reserva>(
      `${this.apiUrl}/${id}/cancelar`,
      { razonCancelacion }
    );
  }

  // Marcar como realizada
  marcarRealizada(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/realizada`, {});
  }

  // Marcar como no asistida
  marcarNoAsistida(id: number): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}/no-asistida`, {});
  }

  // Eliminar reserva
  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
```

## 2. Componente para Crear Reserva

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService, CreateReservaDto } from '../../services/reservation.service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.html',
  styleUrls: ['./create-reservation.css']
})
export class CreateReservationComponent implements OnInit {
  
  idDisponibilidad: number | null = null;
  observaciones: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener ID de disponibilidad de parámetros o contexto
    // this.idDisponibilidad = ...
  }

  crearReserva(): void {
    if (!this.idDisponibilidad) {
      this.error = 'Por favor selecciona una disponibilidad';
      return;
    }

    const idEstudiante = this.getCurrentUserId(); // Obtener del contexto de autenticación

    const dto: CreateReservaDto = {
      idDisponibilidad: this.idDisponibilidad,
      idEstudiante: idEstudiante,
      observaciones: this.observaciones || undefined
    };

    this.loading = true;
    this.error = '';

    this.reservationService.crearReserva(dto).subscribe({
      next: (response) => {
        this.success = '¡Reserva creada exitosamente!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard/reservas']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al crear la reserva';
        this.loading = false;
      }
    });
  }

  private getCurrentUserId(): number {
    // Implementar según tu sistema de autenticación
    return parseInt(localStorage.getItem('userId') || '0');
  }
}
```

## 3. Componente para Listar Reservas del Estudiante

```typescript
import { Component, OnInit } from '@angular/core';
import { ReservationService, Reserva } from '../../services/reservation.service';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.html',
  styleUrls: ['./mis-reservas.css']
})
export class MisReservasComponent implements OnInit {
  
  reservas: Reserva[] = [];
  reservasActivas: Reserva[] = [];
  loading: boolean = true;
  error: string = '';
  idEstudiante: number;
  filtro: 'todas' | 'activas' = 'todas';

  constructor(private reservationService: ReservationService) {
    this.idEstudiante = this.getCurrentUserId();
  }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;
    this.error = '';

    const observable = this.filtro === 'activas' 
      ? this.reservationService.getReservasActivas(this.idEstudiante)
      : this.reservationService.getMisReservas(this.idEstudiante);

    observable.subscribe({
      next: (data) => {
        this.reservas = data;
        if (this.filtro === 'todas') {
          this.reservasActivas = data.filter(r => r.idEstado === 1);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las reservas';
        this.loading = false;
      }
    });
  }

  cancelarReserva(id: number, razon: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservationService.cancelarReserva(id, razon).subscribe({
        next: () => {
          this.cargarReservas();
          alert('Reserva cancelada exitosamente');
        },
        error: (err) => {
          alert(err.error?.mensaje || 'Error al cancelar la reserva');
        }
      });
    }
  }

  obtenerEstado(idEstado: number): string {
    const estados: { [key: number]: string } = {
      1: 'Reservada',
      2: 'Cancelada',
      3: 'Realizada',
      4: 'No Asistida'
    };
    return estados[idEstado] || 'Desconocido';
  }

  obtenerColorEstado(idEstado: number): string {
    const colores: { [key: number]: string } = {
      1: 'badge-success',
      2: 'badge-danger',
      3: 'badge-info',
      4: 'badge-warning'
    };
    return colores[idEstado] || 'badge-secondary';
  }

  private getCurrentUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }
}
```

## 4. Template HTML para Listar Reservas

```html
<div class="container mt-4">
  <h2>Mis Reservas</h2>

  <div class="mb-3">
    <div class="btn-group" role="group">
      <button 
        type="button" 
        class="btn btn-outline-primary"
        [class.active]="filtro === 'todas'"
        (click)="filtro = 'todas'; cargarReservas()">
        Todas
      </button>
      <button 
        type="button" 
        class="btn btn-outline-primary"
        [class.active]="filtro === 'activas'"
        (click)="filtro = 'activas'; cargarReservas()">
        Activas
      </button>
    </div>
  </div>

  <div *ngIf="error" class="alert alert-danger">
    {{ error }}
  </div>

  <div *ngIf="loading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div *ngIf="!loading && reservas.length === 0" class="alert alert-info">
    No tienes reservas aún.
  </div>

  <div *ngIf="!loading && reservas.length > 0" class="table-responsive">
    <table class="table table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Disponibilidad</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let reserva of reservas">
          <td>#{{ reserva.idReserva }}</td>
          <td>Disp. #{{ reserva.idDisponibilidad }}</td>
          <td>
            <span [ngClass]="obtenerColorEstado(reserva.idEstado)" class="badge">
              {{ obtenerEstado(reserva.idEstado) }}
            </span>
          </td>
          <td>{{ reserva.observaciones || '-' }}</td>
          <td>{{ reserva.fechaCreacion | date:'short' }}</td>
          <td>
            <button 
              *ngIf="reserva.idEstado === 1"
              class="btn btn-sm btn-danger"
              (click)="cancelarReserva(reserva.idReserva, 'Cancelada por el estudiante')">
              Cancelar
            </button>
            <button 
              *ngIf="reserva.idEstado === 2"
              class="btn btn-sm btn-secondary"
              disabled>
              Cancelada
            </button>
            <button 
              *ngIf="reserva.idEstado === 3"
              class="btn btn-sm btn-success"
              disabled>
              Realizada
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## 5. Agregar Servicio al Módulo

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReservationService } from './services/reservation.service';

@NgModule({
  imports: [
    HttpClientModule,
    // ... otros imports
  ],
  providers: [
    ReservationService,
    // ... otros providers
  ]
})
export class AppModule { }
```

## 6. Interceptor para JWT (si no lo tienes)

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
```

## 7. Manejo de Errores Comunes

```typescript
private handleError(error: any): void {
  const errorMessage = error?.error?.mensaje || 'Error desconocido';
  
  const mensajes: { [key: string]: string } = {
    'No hay cupos disponibles': 'Esta tutoría está completa en ese horario',
    'Disponibilidad no encontrada': 'El horario seleccionado no existe',
    'Estudiante no encontrado': 'Tu cuenta de estudiante no fue encontrada',
    'Reserva ya existe': 'Ya tienes una reserva en esta tutoría',
  };

  const mensaje = mensajes[errorMessage] || errorMessage;
  console.error('Error:', mensaje);
}
```

## 8. Rutas Sugeridas en app.routes.ts

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'reservas',
        component: MisReservasComponent
      },
      {
        path: 'crear-reserva',
        component: CreateReservationComponent
      }
    ]
  }
];
```

## Resumen de Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reservas/list` | Todas las reservas |
| GET | `/api/reservas/{id}` | Una reserva específica |
| GET | `/api/reservas/estudiante/{id}` | Mis reservas |
| GET | `/api/reservas/estudiante/{id}/activas` | Mis activas |
| GET | `/api/reservas/disponibilidad/{id}` | Por disponibilidad |
| POST | `/api/reservas/` | Crear reserva |
| PUT | `/api/reservas/{id}` | Actualizar |
| PUT | `/api/reservas/{id}/cancelar` | Cancelar |
| PUT | `/api/reservas/{id}/realizada` | Marcar realizada |
| PUT | `/api/reservas/{id}/no-asistida` | Marcar no asistida |
| DELETE | `/api/reservas/{id}` | Eliminar |

---

**Guía completada**: 7 de noviembre de 2025

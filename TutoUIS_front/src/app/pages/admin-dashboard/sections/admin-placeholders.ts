import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService, Reserva } from '../../../services/reservation.service';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-calendar-check me-2"></i>Gestión de Reservas
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div *ngIf="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {{ error }}
          <button type="button" class="btn btn-sm btn-outline-danger ms-3" (click)="loadReservations()">
            <i class="bi bi-arrow-clockwise me-1"></i>Reintentar
          </button>
        </div>

        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando reservas...</p>
        </div>

        <div *ngIf="!loading && !error && reservas.length === 0" class="empty-state">
          <i class="bi bi-calendar-event"></i>
          <h5>No hay reservas</h5>
          <p class="text-muted">Aún no se han creado reservas en el sistema</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>

        <div *ngIf="!loading && !error && reservas.length > 0">
          <!-- Filtros y búsqueda -->
          <div class="filters-section mb-4">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text bg-white">
                    <i class="bi bi-search"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Buscar por ID estudiante o disponibilidad..."
                    [(ngModel)]="searchTerm"
                    (ngModelChange)="applyFilters()">
                </div>
              </div>
              <div class="col-md-3">
                <select class="form-select" [(ngModel)]="filterEstado" (ngModelChange)="applyFilters()">
                  <option value="">Todos los estados</option>
                  <option value="Reservada">Reservada</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-select" [(ngModel)]="filterFecha" (ngModelChange)="applyFilters()">
                  <option value="">Todas las fechas</option>
                  <option value="hoy">Hoy</option>
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mes</option>
                </select>
              </div>
              <div class="col-md-2">
                <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
                  <i class="bi bi-x-circle me-1"></i>Limpiar
                </button>
              </div>
            </div>
          </div>

          <!-- Header con estadísticas -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="mb-1">Total de Reservas</h5>
              <p class="text-muted mb-0">
                Mostrando {{ reservasFiltradas.length }} de {{ reservas.length }} reservas
              </p>
            </div>
            <a routerLink="/admin-dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-2"></i>Volver al panel
            </a>
          </div>

          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante ID</th>
                  <th>Disponibilidad ID</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let reserva of reservasFiltradas">
                  <td><strong>#{{ reserva.idReserva }}</strong></td>
                  <td>
                    <span class="badge bg-info">
                      <i class="bi bi-person me-1"></i>{{ reserva.idEstudiante }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-secondary">
                      <i class="bi bi-calendar3 me-1"></i>{{ reserva.idDisponibilidad }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': reserva.estadoReserva.nombre === 'Reservada',
                      'bg-warning': reserva.estadoReserva.nombre === 'Pendiente',
                      'bg-danger': reserva.estadoReserva.nombre === 'Cancelada',
                      'bg-primary': reserva.estadoReserva.nombre === 'Completada'
                    }">
                      {{ reserva.estadoReserva.nombre || 'Sin estado' }}
                    </span>
                  </td>
                  <td>
                    <span class="text-muted small" [title]="reserva.observaciones || 'Sin observaciones'">
                      {{ (reserva.observaciones && reserva.observaciones.length > 50) 
                         ? (reserva.observaciones | slice:0:50) + '...' 
                         : (reserva.observaciones || 'Sin observaciones') }}
                    </span>
                  </td>
                  <td>
                    <span *ngIf="reserva.fechaCreacion" class="text-muted small">
                      {{ reserva.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                    <span *ngIf="!reserva.fechaCreacion" class="text-muted small">
                      No registrada
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" title="Ver detalles">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Cancelar">
                      <i class="bi bi-x-circle"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="reservasFiltradas.length === 0 && reservas.length > 0" class="text-center py-4">
            <i class="bi bi-filter-circle text-muted" style="font-size: 3rem;"></i>
            <p class="text-muted mt-3">No se encontraron reservas con los filtros aplicados</p>
            <button class="btn btn-outline-secondary" (click)="clearFilters()">
              <i class="bi bi-x-circle me-1"></i>Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .filters-section {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
    .input-group-text {
      border-right: none;
    }
    .input-group .form-control {
      border-left: none;
    }
    .input-group .form-control:focus {
      border-color: #ced4da;
      box-shadow: none;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .table {
      margin-bottom: 0;
    }
    .table thead th {
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
      color: #495057;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      padding: 12px;
    }
    .table tbody td {
      vertical-align: middle;
      padding: 12px;
    }
    .table tbody tr:hover {
      background-color: #f8f9fa;
    }
    .badge {
      padding: 6px 12px;
      font-weight: 500;
      font-size: 0.75rem;
    }
    .btn-sm {
      padding: 4px 8px;
      font-size: 0.875rem;
    }
    .alert {
      border-radius: 8px;
    }
  `]
})
export class AdminReservations implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  searchTerm = '';
  filterEstado = '';
  filterFecha = '';

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('AdminReservations - ngOnInit');
    this.loadReservations();
    
    // Timeout de seguridad: si después de 15 segundos sigue cargando, forzar detención
    setTimeout(() => {
      if (this.loading) {
        console.error('AdminReservations - TIMEOUT: Carga tomó más de 15 segundos');
        this.loading = false;
        this.error = 'La carga está tardando demasiado. Por favor, verifica que el backend esté corriendo.';
        this.cdr.detectChanges();
      }
    }, 15000);
  }

  loadReservations() {
    console.log('AdminReservations - Iniciando carga de reservas...');
    this.loading = true;
    this.error = null;
    
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        console.log('AdminReservations - Reservas recibidas:', data.length, data);
        this.reservas = data;
        this.reservasFiltradas = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('AdminReservations - Estado después de cargar:', {
          reservas: this.reservas.length,
          filtradas: this.reservasFiltradas.length,
          loading: this.loading
        });
      },
      error: (error) => {
        console.error('AdminReservations - Error al cargar reservas:', error);
        this.error = 'No se pudieron cargar las reservas. Verifica tu conexión y que el backend esté activo.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      // Filtro por búsqueda (ID estudiante o disponibilidad)
      const matchSearch = this.searchTerm === '' || 
        reserva.idEstudiante.toString().includes(this.searchTerm) ||
        reserva.idDisponibilidad.toString().includes(this.searchTerm) ||
        reserva.idReserva.toString().includes(this.searchTerm);

      // Filtro por estado
      const matchEstado = this.filterEstado === '' || 
        reserva.estadoReserva.nombre === this.filterEstado;

      // Filtro por fecha
      let matchFecha = true;
      if (this.filterFecha && reserva.fechaCreacion) {
        const fechaReserva = new Date(reserva.fechaCreacion);
        const hoy = new Date();
        
        if (this.filterFecha === 'hoy') {
          matchFecha = fechaReserva.toDateString() === hoy.toDateString();
        } else if (this.filterFecha === 'semana') {
          const semanaAtras = new Date();
          semanaAtras.setDate(hoy.getDate() - 7);
          matchFecha = fechaReserva >= semanaAtras;
        } else if (this.filterFecha === 'mes') {
          const mesAtras = new Date();
          mesAtras.setMonth(hoy.getMonth() - 1);
          matchFecha = fechaReserva >= mesAtras;
        }
      }

      return matchSearch && matchEstado && matchFecha;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterEstado = '';
    this.filterFecha = '';
    this.reservasFiltradas = this.reservas;
  }
}

@Component({
  selector: 'app-admin-spaces',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-door-open me-2"></i>Gestión de Espacios
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-building"></i>
          <h5>Gestión de Espacios</h5>
          <p class="text-muted">Aquí se mostrará la lista completa de espacios disponibles</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `]
})
export class AdminSpaces {}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-graph-up me-2"></i>Reportes y Estadísticas
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-file-earmark-text"></i>
          <h5>Reportes y Estadísticas</h5>
          <p class="text-muted">Aquí se mostrarán los reportes y análisis del sistema</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `]
})
export class AdminReports {}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        <i class="bi bi-gear me-2"></i>Configuración del Sistema
      </h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="empty-state">
          <i class="bi bi-sliders"></i>
          <h5>Configuración del Sistema</h5>
          <p class="text-muted">Aquí podrás configurar parámetros globales del sistema</p>
          <a routerLink="/admin-dashboard" class="btn btn-outline-secondary mt-3">
            <i class="bi bi-arrow-left me-2"></i>Volver al panel
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 30px;
    }
    .page-title {
      color: #155724;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .page-title i {
      font-size: 1.8rem;
    }
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .card-body {
      padding: 25px;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i {
      font-size: 4rem;
      color: #dee2e6;
      margin-bottom: 20px;
    }
    .empty-state h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `]
})
export class AdminSettings {}

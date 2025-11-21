import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CarreraService } from '../../../services/carrera.service';

interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  telefono?: string;
  id_rol: number;
  id_carrera?: number;
  activo: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="section-content">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <div class="profile-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="header-info">
            @if (isLoading) {
              <div class="loading-skeleton" style="width: 250px; height: 28px; margin-bottom: 8px;"></div>
              <div class="loading-skeleton" style="width: 180px; height: 20px;"></div>
            } @else {
              <h1 class="profile-name">{{ profileData?.nombre }} {{ profileData?.apellido }}</h1>
              <p class="profile-role">
                <i class="bi bi-shield-check"></i>
                {{ getRoleName(profileData?.id_rol) }}
              </p>
            }
          </div>
        </div>
        <div class="header-actions">
          <span class="status-badge" [class.active]="profileData?.activo" [class.inactive]="!profileData?.activo">
            <i class="bi" [class.bi-check-circle-fill]="profileData?.activo" [class.bi-x-circle-fill]="!profileData?.activo"></i>
            {{ profileData?.activo ? 'Activo' : 'Inactivo' }}
          </span>
          <button class="btn-edit" (click)="toggleEditMode()" [class.active]="isEditing">
            @if (!isEditing) {
              <i class="bi bi-pencil-square"></i>
              <span>Editar Perfil</span>
            } @else {
              <i class="bi bi-x-lg"></i>
              <span>Cancelar</span>
            }
          </button>
        </div>
      </div>

      <!-- Profile Cards Grid -->
      <div class="profile-grid">
        <!-- Información Personal -->
        <div class="info-card">
          <div class="card-header-custom">
            <i class="bi bi-person-badge"></i>
            <h3>Información Personal</h3>
          </div>
          <div class="card-content">
            @if (isLoading) {
              <div class="loading-skeleton" style="width: 100%; height: 20px; margin-bottom: 16px;"></div>
              <div class="loading-skeleton" style="width: 100%; height: 20px; margin-bottom: 16px;"></div>
              <div class="loading-skeleton" style="width: 100%; height: 20px;"></div>
            } @else {
              <div class="info-row">
                <div class="info-icon blue">
                  <i class="bi bi-person"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Nombre Completo</span>
                  <span class="info-value">{{ profileData?.nombre }} {{ profileData?.apellido }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon purple">
                  <i class="bi bi-hash"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Código Estudiantil</span>
                  <span class="info-value">{{ profileData?.codigo }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon orange">
                  <i class="bi bi-key"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">ID de Usuario</span>
                  <span class="info-value">#{{ profileData?.id_usuario }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="info-card">
          <div class="card-header-custom">
            <i class="bi bi-envelope-at"></i>
            <h3>Contacto</h3>
          </div>
          <div class="card-content">
            @if (isLoading) {
              <div class="loading-skeleton" style="width: 100%; height: 20px; margin-bottom: 16px;"></div>
              <div class="loading-skeleton" style="width: 100%; height: 20px;"></div>
            } @else {
              <div class="info-row">
                <div class="info-icon green">
                  <i class="bi bi-envelope"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Correo Electrónico</span>
                  <span class="info-value">{{ profileData?.correo }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon teal">
                  <i class="bi bi-telephone"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Teléfono</span>
                  <span class="info-value">{{ profileData?.telefono || 'No registrado' }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Información Académica -->
        <div class="info-card">
          <div class="card-header-custom">
            <i class="bi bi-mortarboard"></i>
            <h3>Información Académica</h3>
          </div>
          <div class="card-content">
            @if (isLoading) {
              <div class="loading-skeleton" style="width: 100%; height: 20px; margin-bottom: 16px;"></div>
              <div class="loading-skeleton" style="width: 100%; height: 20px;"></div>
            } @else {
              <div class="info-row">
                <div class="info-icon indigo">
                  <i class="bi bi-book"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Carrera</span>
                  <span class="info-value">{{ getCarreraName(profileData?.id_carrera) }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon pink">
                  <i class="bi bi-calendar-check"></i>
                </div>
                <div class="info-details">
                  <span class="info-label">Estado de Cuenta</span>
                  <span class="info-value">{{ profileData?.activo ? 'Cuenta Activa' : 'Cuenta Inactiva' }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Edit Form Modal -->
      @if (isEditing) {
        <div class="edit-modal">
          <div class="modal-backdrop" (click)="cancelEdit()"></div>
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-header-info">
                <i class="bi bi-pencil-square"></i>
                <h2>Editar Información de Contacto</h2>
              </div>
              <button class="modal-close" (click)="cancelEdit()">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form (ngSubmit)="onSubmit()" class="modal-form">
              <div class="form-group">
                <label for="correo">
                  <i class="bi bi-envelope"></i>
                  Correo Electrónico
                  <span class="required">*</span>
                </label>
                <input
                  type="email"
                  id="correo"
                  class="form-input"
                  [(ngModel)]="editData.correo"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="telefono">
                  <i class="bi bi-telephone"></i>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  class="form-input"
                  [(ngModel)]="editData.telefono"
                  name="telefono"
                  placeholder="+57 123 456 7890"
                />
              </div>

              @if (errorMessage) {
                <div class="error-alert">
                  <i class="bi bi-exclamation-triangle"></i>
                  <span>{{ errorMessage }}</span>
                </div>
              }

              @if (successMessage) {
                <div class="success-alert">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>{{ successMessage }}</span>
                </div>
              }

              <div class="form-actions">
                <button type="button" class="btn-cancel" (click)="cancelEdit()">
                  <i class="bi bi-x-circle"></i>
                  Cancelar
                </button>
                <button type="submit" class="btn-save" [disabled]="isSubmitting">
                  @if (isSubmitting) {
                    <span class="spinner"></span>
                    Guardando...
                  } @else {
                    <i class="bi bi-check-circle"></i>
                    Guardar Cambios
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profileData: UserProfile | null = null;
  editData: any = {};
  isEditing: boolean = false;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private carreraService: CarreraService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
    this.loadCarreras();
  }

  loadProfileData(): void {
    // Primero, mostrar datos en caché si existen
    const cachedProfile = this.authService.getCachedProfile();
    if (cachedProfile) {
      this.profileData = cachedProfile;
      this.editData = { ...cachedProfile };
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }

    this.errorMessage = '';
    
    // Luego, cargar datos frescos del servidor
    this.authService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        this.profileData = profile;
        this.editData = { ...profile };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        // Si no hay caché y hay error, mostrar mensaje
        if (!cachedProfile) {
          this.errorMessage = 'Error al cargar los datos del usuario';
        }
        this.isLoading = false;
      }
    });
  }

  getRoleName(rolId: number | undefined): string {
      if (!rolId) return 'Sin asignar';
      const roles: { [key: number]: string } = {
        1: 'Administrador',
        2: 'Tutor',
        3: 'Estudiante'
      };
      return roles[rolId] || `Rol ${rolId}`;
  }

  loadCarreras(): void {
    // Cargar carreras desde el servidor
    this.carreraService.getCarreras().subscribe({
      next: (carreras) => {
        console.log('Carreras cargadas:', carreras);
      },
      error: (error) => {
        console.error('Error cargando carreras:', error);
      }
    });
  }

  getCarreraName(carreraId: number | undefined): string {
    if (!carreraId) return 'No asignada';
    return this.carreraService.getCarreraNameById(carreraId);
  }

  toggleEditMode(): void {
    if (this.isEditing) {
      this.cancelEdit();
    } else {
      this.isEditing = true;
      this.editData = { ...this.profileData };
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editData = { ...this.profileData };
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.editData.correo) {
      this.errorMessage = 'El correo electrónico es requerido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Solo enviamos los campos editables y mantenemos el resto de datos sin cambios
    const dataToUpdate = {
      ...this.profileData,
      correo: this.editData.correo,
      telefono: this.editData.telefono
    };

    this.authService.updateUserProfile(dataToUpdate).subscribe({
      next: (response) => {
        this.profileData = response;
        this.editData = { ...response };
        this.isSubmitting = false;
        
        // Mostrar mensaje de éxito
        this.successMessage = 'Perfil actualizado correctamente';
        
        // Cerrar el modal después de mostrar el mensaje brevemente
        setTimeout(() => {
          this.isEditing = false;
          this.successMessage = '';
          this.cd.detectChanges();
        }, 1500);
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        this.errorMessage = error.error?.message || 'Error al actualizar el perfil';
        this.isSubmitting = false;
      }
    });
  }
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-content">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-gear me-2"></i>Configuración
          </h5>
        </div>
        <div class="card-body text-center py-5">
          <i class="bi bi-sliders" style="font-size: 3rem; color: #dc3545;"></i>
          <p class="mt-3 text-muted">Aquí podrás ajustar las preferencias de la aplicación</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './placeholder.css'
})
export class Settings {}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="section-content">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-list-ul me-2"></i>Mis Reservas
          </h5>
        </div>
        <div class="card-body text-center py-5">
          <i class="bi bi-calendar-check" style="font-size: 3rem; color: #28a745;"></i>
          <p class="mt-3 text-muted">Aquí aparecerán todas tus reservas actuales</p>
          <a routerLink="/dashboard/reservation" class="btn btn-success">
            <i class="bi bi-plus-circle me-2"></i>Crear Nueva Reserva
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './placeholder.css'
})
export class Reservations {}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="section-content">
      <!-- Header -->
      <div class="history-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="bi bi-clock-history"></i>
          </div>
          <div>
            <h1 class="page-title">Historial de Reservas</h1>
            <p class="page-subtitle">Todas tus sesiones de tutoría completadas</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-badge">
            <i class="bi bi-check-circle"></i>
            <span>{{ completedCount }} Completadas</span>
          </div>
          <div class="stat-badge cancelled">
            <i class="bi bi-x-circle"></i>
            <span>{{ cancelledCount }} Canceladas</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <button class="filter-btn" [class.active]="currentFilter === 'all'" (click)="setFilter('all')">
            <i class="bi bi-calendar-check"></i>
            Todas ({{ filteredList.length }})
          </button>
          <button class="filter-btn" [class.active]="currentFilter === 'completed'" (click)="setFilter('completed')">
            <i class="bi bi-check-circle"></i>
            Completadas
          </button>
          <button class="filter-btn" [class.active]="currentFilter === 'cancelled'" (click)="setFilter('cancelled')">
            <i class="bi bi-x-circle"></i>
            Canceladas
          </button>
        </div>
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Buscar por materia o tutor..." [(ngModel)]="searchText" (input)="applyFilters()">
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading) {
        <div class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando historial de reservas...</p>
        </div>
      }

      <!-- Empty State -->
      @else if (filteredList.length === 0 && !isLoading) {
        <div class="empty-state">
          <i class="bi bi-inbox"></i>
          <h3>No se encontraron reservas</h3>
          <p>{{ searchText ? 'Intenta con otro término de búsqueda' : 'Aún no has realizado ninguna reserva' }}</p>
        </div>
      }

      <!-- Timeline -->
      @else {
        <div class="history-timeline">
          @for (item of filteredList; track item.idReserva) {
            <div class="timeline-item" [class.cancelled]="item.nombreEstado === 'Cancelada'">
              <div class="timeline-marker">
                <i class="bi" [class.bi-check-circle-fill]="item.nombreEstado === 'Realizada'" 
                   [class.bi-x-circle-fill]="item.nombreEstado === 'Cancelada'"></i>
              </div>
              <div class="timeline-card">
                <div class="card-header-row">
                  <div class="subject-info">
                    <h3>{{ item.nombreAsignatura || 'Asignatura no disponible' }}</h3>
                    <span class="badge" [class.badge-success]="item.nombreEstado === 'Realizada'"
                          [class.badge-danger]="item.nombreEstado === 'Cancelada'"
                          [class.badge-warning]="item.nombreEstado === 'Reservada'"
                          [class.badge-secondary]="item.nombreEstado === 'No Asistida'">
                      {{ item.nombreEstado }}
                    </span>
                  </div>
                </div>
                
                <div class="card-details">
                  <div class="detail-row">
                    <i class="bi bi-person"></i>
                    <span>Tutor: <strong>{{ item.nombreTutor || 'No disponible' }}</strong></span>
                  </div>
                  <div class="detail-row">
                    <i class="bi bi-calendar3"></i>
                    <span>{{ formatDate(item.fechaCreacion) }}</span>
                  </div>
                  <div class="detail-row">
                    <i class="bi bi-clock"></i>
                    <span>{{ formatTime(item.horaInicio) }} - {{ formatTime(item.horaFin) }}</span>
                  </div>
                  @if (item.observaciones) {
                    <div class="detail-row">
                      <i class="bi bi-file-text"></i>
                      <span>{{ item.observaciones }}</span>
                    </div>
                  }
                </div>

                @if (item.nombreEstado === 'Cancelada' && item.razonCancelacion) {
                  <div class="cancel-reason">
                    <i class="bi bi-info-circle"></i>
                    <span>{{ item.razonCancelacion }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Stats Summary -->
      <div class="summary-section">
        <h3 class="summary-title">
          <i class="bi bi-bar-chart"></i>
          Resumen de Actividad
        </h3>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-icon blue">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ allReservations.length }}</span>
              <span class="summary-label">Total Reservas</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon green">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ completedCount }}</span>
              <span class="summary-label">Realizadas</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon red">
              <i class="bi bi-x-circle"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ cancelledCount }}</span>
              <span class="summary-label">Canceladas</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon purple">
              <i class="bi bi-clock"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ activeCount }}</span>
              <span class="summary-label">Activas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './history.css'
})
export class History implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  allReservations: any[] = [];
  filteredList: any[] = [];
  currentFilter: 'all' | 'completed' | 'cancelled' = 'all';
  searchText: string = '';
  isLoading: boolean = true;

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    const startTime = performance.now();
    this.isLoading = true;
    const userData = this.authService.getUserData();
    
    if (!userData) {
      console.error('No hay datos de usuario');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const idUsuario = (userData as any).id_usuario || (userData as any).idUsuario;

    const reqStart = performance.now();
    // Obtener todas las reservas del usuario (ya vienen con asignatura y tutor desde el backend)
    this.reservationService.getUserReservations(idUsuario).subscribe({
      next: (reservas) => {
        const reqDuration = performance.now() - reqStart;
        console.log(`✅ [Historial] Datos recibidos en ${reqDuration.toFixed(2)}ms. Registros: ${reservas.length}`);
        this.allReservations = reservas;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log(`⏱️ [Historial] Total: ${(performance.now()-startTime).toFixed(2)}ms`);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setFilter(filter: 'all' | 'completed' | 'cancelled') {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allReservations];

    // Filtrar por estado
    if (this.currentFilter === 'completed') {
      filtered = filtered.filter(r => r.nombreEstado === 'Realizada');
    } else if (this.currentFilter === 'cancelled') {
      filtered = filtered.filter(r => r.nombreEstado === 'Cancelada');
    }

    // Filtrar por búsqueda
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(r => 
        (r.nombreAsignatura && r.nombreAsignatura.toLowerCase().includes(searchLower)) ||
        (r.nombreTutor && r.nombreTutor.toLowerCase().includes(searchLower))
      );
    }

    this.filteredList = filtered;
    this.cdr.detectChanges();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.substring(0, 5); // "HH:mm:ss" -> "HH:mm"
  }

  get completedCount(): number {
    return this.allReservations.filter(r => r.nombreEstado === 'Realizada').length;
  }

  get cancelledCount(): number {
    return this.allReservations.filter(r => r.nombreEstado === 'Cancelada').length;
  }

  get activeCount(): number {
    return this.allReservations.filter(r => r.nombreEstado === 'Reservada').length;
  }
}

import { ReservationService } from '../../../services/reservation.service';
import { inject } from '@angular/core';


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
          <div class="modal-content">
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

  constructor(
    private authService: AuthService,
    private carreraService: CarreraService,
    private cd: ChangeDetectorRef
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
        this.isEditing = false;
        // stop the submitting state first so the UI can update (spinner removed)
        this.isSubmitting = false;

        // force change detection so the template reflects isSubmitting=false
        // before we show the blocking alert
        try {
          this.cd.detectChanges();
        } catch (e) {
          // ignore - detectChanges may not be necessary in all environments
          console.debug('detectChanges failed or unnecessary', e);
        }

        // show the blocking alert after the UI updates so the spinner isn't
        // still visible while the native alert is open
        setTimeout(() => {
          alert('Perfil actualizado correctamente');
        }, 0);
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
  imports: [CommonModule],
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
          <button class="filter-btn active">
            <i class="bi bi-calendar-check"></i>
            Todas ({{ historyList.length }})
          </button>
          <button class="filter-btn">
            <i class="bi bi-check-circle"></i>
            Completadas
          </button>
          <button class="filter-btn">
            <i class="bi bi-x-circle"></i>
            Canceladas
          </button>
        </div>
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Buscar por materia o tutor...">
        </div>
      </div>

      <!-- Timeline -->
      <div class="history-timeline">
        @for (item of historyList; track item.id) {
          <div class="timeline-item" [class.cancelled]="item.status === 'cancelled'">
            <div class="timeline-marker">
              <i class="bi" [class.bi-check-circle-fill]="item.status === 'completed'" 
                 [class.bi-x-circle-fill]="item.status === 'cancelled'"></i>
            </div>
            <div class="timeline-card">
              <div class="card-header-row">
                <div class="subject-info">
                  <h3>{{ item.subject }}</h3>
                  <span class="badge" [class.badge-success]="item.status === 'completed'"
                        [class.badge-danger]="item.status === 'cancelled'">
                    {{ item.status === 'completed' ? 'Completada' : 'Cancelada' }}
                  </span>
                </div>
                @if (item.status === 'completed') {
                  <div class="rating-stars">
                    @for (star of [1,2,3,4,5]; track star) {
                      <i class="bi bi-star-fill" [class.active]="star <= (item.rating || 0)"></i>
                    }
                  </div>
                }
              </div>
              
              <div class="card-details">
                <div class="detail-row">
                  <i class="bi bi-person"></i>
                  <span>Tutor: <strong>{{ item.tutor }}</strong></span>
                </div>
                <div class="detail-row">
                  <i class="bi bi-calendar3"></i>
                  <span>{{ item.date }}</span>
                </div>
                <div class="detail-row">
                  <i class="bi bi-clock"></i>
                  <span>{{ item.time }}</span>
                </div>
                <div class="detail-row">
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ item.location }}</span>
                </div>
              </div>

              @if (item.status === 'completed' && item.comment) {
                <div class="comment-section">
                  <i class="bi bi-chat-left-quote"></i>
                  <p>"{{ item.comment }}"</p>
                </div>
              }

              @if (item.status === 'cancelled' && item.cancelReason) {
                <div class="cancel-reason">
                  <i class="bi bi-info-circle"></i>
                  <span>{{ item.cancelReason }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

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
              <span class="summary-value">{{ historyList.length }}</span>
              <span class="summary-label">Total Reservas</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon green">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ completedCount }}</span>
              <span class="summary-label">Completadas</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon orange">
              <i class="bi bi-star-fill"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ averageRating }}</span>
              <span class="summary-label">Calificación Promedio</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon purple">
              <i class="bi bi-clock"></i>
            </div>
            <div class="summary-data">
              <span class="summary-value">{{ totalHours }}h</span>
              <span class="summary-label">Horas Totales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './history.css'
})
export class History {
  historyList = [
    {
      id: 1,
      subject: 'Cálculo Diferencial',
      tutor: 'Dr. Carlos Ramírez',
      date: '15 de Noviembre, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Sala B-203',
      status: 'completed',
      rating: 5,
      comment: 'Excelente explicación de derivadas. Muy clara la sesión.'
    },
    {
      id: 2,
      subject: 'Programación Orientada a Objetos',
      tutor: 'Ing. María González',
      date: '10 de Noviembre, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Laboratorio 3',
      status: 'completed',
      rating: 4,
      comment: 'Buena sesión sobre herencia y polimorfismo.'
    },
    {
      id: 3,
      subject: 'Física II',
      tutor: 'Dr. Jorge Méndez',
      date: '8 de Noviembre, 2025',
      time: '3:00 PM - 5:00 PM',
      location: 'Sala C-105',
      status: 'cancelled',
      cancelReason: 'Cancelada por el estudiante con 2 horas de anticipación'
    },
    {
      id: 4,
      subject: 'Álgebra Lineal',
      tutor: 'Prof. Ana Torres',
      date: '5 de Noviembre, 2025',
      time: '9:00 AM - 11:00 AM',
      location: 'Sala A-301',
      status: 'completed',
      rating: 5,
      comment: 'Perfecta explicación de matrices y determinantes.'
    },
    {
      id: 5,
      subject: 'Bases de Datos',
      tutor: 'Ing. Pedro Ruiz',
      date: '1 de Noviembre, 2025',
      time: '1:00 PM - 3:00 PM',
      location: 'Laboratorio 5',
      status: 'completed',
      rating: 4,
      comment: 'Muy útil para entender normalización de datos.'
    }
  ];

  get completedCount(): number {
    return this.historyList.filter(item => item.status === 'completed').length;
  }

  get cancelledCount(): number {
    return this.historyList.filter(item => item.status === 'cancelled').length;
  }

  get averageRating(): number {
    const completed = this.historyList.filter(item => item.status === 'completed');
    const sum = completed.reduce((acc, item) => acc + (item.rating || 0), 0);
    return completed.length > 0 ? Number((sum / completed.length).toFixed(1)) : 0;
  }

  get totalHours(): number {
    return this.historyList.length * 2; // Asumiendo 2 horas por sesión
  }
}


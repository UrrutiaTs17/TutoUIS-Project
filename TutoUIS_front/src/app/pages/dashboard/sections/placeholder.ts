import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
      <!-- TARJETA DE PERFIL PRINCIPAL -->
      <div class="user-profile-card mb-4">
        <div class="card">
          <div class="card-body">
            <!-- Loading Skeleton -->
            @if (isLoading) {
              <div class="skeleton-loader">
                <div class="d-flex justify-content-between align-items-start mb-4">
                  <div class="user-info">
                    <h4 class="loading-skeleton" style="width: 300px; height: 2rem;"></h4>
                    <span class="badge loading-skeleton" style="width: 100px; height: 2rem; display: inline-block;"></span>
                  </div>
                  <button class="btn btn-primary loading-skeleton" style="width: 150px; height: 2.5rem;"></button>
                </div>
              </div>
            } @else {
              <!-- Header con nombre y botón editar -->
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="user-info">
                  <h4>
                    <i class="bi bi-person-circle me-2"></i>
                    {{ profileData?.nombre }} {{ profileData?.apellido }}
                  </h4>
                  <span class="badge" [ngClass]="profileData?.activo ? 'bg-success' : 'bg-danger'">
                    <i class="bi me-1" [ngClass]="profileData?.activo ? 'bi-check-circle' : 'bi-x-circle'"></i>
                    {{ profileData?.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <button 
                  class="btn btn-primary"
                  (click)="toggleEditMode()"
                  title="Editar información de usuario"
                >
                  @if (!isEditing) {
                    <i class="bi bi-pencil-square me-2"></i><span>Editar Perfil</span>
                  } @else {
                    <i class="bi bi-x-lg me-2"></i><span>Cerrar</span>
                  }
                </button>
              </div>

              <!-- Datos del usuario -->
              <div class="user-details">
                <div class="row">
                  <div class="col-md-6">
                    <p>
                      <i class="bi bi-code-square"></i>
                      <strong>Código:</strong> 
                      <span>{{ profileData?.codigo }}</span>
                    </p>
                    <p>
                      <i class="bi bi-envelope"></i>
                      <strong>Correo:</strong> 
                      <span>{{ profileData?.correo }}</span>
                    </p>
                    <p>
                      <i class="bi bi-telephone"></i>
                      <strong>Teléfono:</strong> 
                      <span>{{ profileData?.telefono || 'No registrado' }}</span>
                    </p>
                  </div>
                  <div class="col-md-6">
                    <p>
                      <i class="bi bi-shield-check"></i>
                      <strong>Rol:</strong> 
                      <span>{{ getRoleName(profileData?.id_rol) }}</span>
                    </p>
                    <p>
                      <i class="bi bi-book"></i>
                      <strong>Carrera:</strong> 
                      <span>{{ profileData?.id_carrera || 'No asignada' }}</span>
                    </p>
                    <p>
                      <i class="bi bi-calendar"></i>
                      <strong>ID Usuario:</strong> 
                      <span>#{{ profileData?.id_usuario }}</span>
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- FORMULARIO DE EDICIÓN -->
      @if (isEditing) {
        <div class="card">
          <div class="card-header" style="background: linear-gradient(135deg, #1e7e34 0%, #155724 100%); color: white;">
            <h5 class="mb-0">
              <i class="bi bi-pencil-square me-2"></i>Editar Perfil de Usuario
            </h5>
          </div>
          <div class="card-body">
            <div class="edit-form-section">
              <form (ngSubmit)="onSubmit()">
                <!-- Fila 1: Nombre y Apellido -->
                <div class="row">
                  <div class="col-md-6">
                    <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      id="nombre"
                      [(ngModel)]="editData.nombre"
                      name="nombre"
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="apellido" class="form-label">Apellido <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      id="apellido"
                      [(ngModel)]="editData.apellido"
                      name="apellido"
                      placeholder="Ingresa tu apellido"
                      required
                    />
                  </div>
                </div>

                <!-- Fila 2: Código y Correo -->
                <div class="row">
                  <div class="col-md-6">
                    <label for="codigo" class="form-label">Código</label>
                    <input
                      type="text"
                      class="form-control"
                      id="codigo"
                      [value]="editData.codigo"
                      disabled
                    />
                    <small class="text-muted"><i class="bi bi-info-circle me-1"></i>El código no puede ser modificado</small>
                  </div>
                  <div class="col-md-6">
                    <label for="correo" class="form-label">Correo Electrónico <span class="text-danger">*</span></label>
                    <input
                      type="email"
                      class="form-control"
                      id="correo"
                      [(ngModel)]="editData.correo"
                      name="correo"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <!-- Fila 3: Teléfono y Carrera -->
                <div class="row">
                  <div class="col-md-6">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="telefono"
                      [(ngModel)]="editData.telefono"
                      name="telefono"
                      placeholder="+57 123 456 7890"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="id_carrera" class="form-label">Carrera</label>
                    <input
                      type="number"
                      class="form-control"
                      id="id_carrera"
                      [(ngModel)]="editData.id_carrera"
                      name="id_carrera"
                      placeholder="ID de la carrera"
                    />
                  </div>
                </div>

                <!-- Mensajes de error -->
                @if (errorMessage) {
                  <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
                  </div>
                }

                <!-- Botones de acción -->
                <div class="form-buttons">
                  <button type="submit" class="btn btn-success" [disabled]="isSubmitting">
                    @if (isSubmitting) {
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    } @else {
                      <i class="bi bi-check-circle me-2"></i>Guardar Cambios
                    }
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelEdit()">
                    <i class="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                </div>
              </form>
            </div>
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfileData();
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
      2: 'Estudiante',
      3: 'Docente',
      4: 'Personal'
    };
    return roles[rolId] || `Rol ${rolId}`;
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
    if (!this.editData.nombre || !this.editData.apellido || !this.editData.correo) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const dataToUpdate = { ...this.editData };

    this.authService.updateUserProfile(dataToUpdate).subscribe({
      next: (response) => {
        this.profileData = response;
        this.editData = { ...response };
        this.isEditing = false;
        this.isSubmitting = false;
        alert('Perfil actualizado correctamente');
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
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-clock-history me-2"></i>Historial de Reservas
          </h5>
        </div>
        <div class="card-body text-center py-5">
          <i class="bi bi-hourglass-split" style="font-size: 3rem; color: #007bff;"></i>
          <p class="mt-3 text-muted">Aquí aparecerá tu historial de reservas pasadas</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './placeholder.css'
})
export class History {}

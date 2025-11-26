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
  templateUrl: './profile.html',
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
  templateUrl: './history.html',
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


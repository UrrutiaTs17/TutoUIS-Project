import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService, ActividadReciente } from '../../../../services/actividad.service';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsersThisMonth: number;
}

interface ReservationStats {
  totalReservations: number;
  activeReservations: number;
  completedReservations: number;
  cancelledReservations: number;
}

interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'reservation' | 'room' | 'report';
  description: string;
  timestamp: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {
  currentPageTitle: string = 'Panel de Administración';
  isLoadingActivities: boolean = false;

  // Estadísticas
  userStats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    newUsersThisMonth: 0
  };

  reservationStats: ReservationStats = {
    totalReservations: 0,
    activeReservations: 0,
    completedReservations: 0,
    cancelledReservations: 0
  };

  roomStats: RoomStats = {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0
  };

  recentActivities: RecentActivity[] = [];

  constructor(
    private actividadService: ActividadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentActivities();
  }

  /**
   * Carga las estadísticas del sistema
   */
  private loadStatistics(): void {
    // TODO: Implementar llamadas a los servicios
    // Por ahora, datos de ejemplo
    this.userStats = {
      totalUsers: 245,
      activeUsers: 198,
      blockedUsers: 5,
      newUsersThisMonth: 12
    };

    this.reservationStats = {
      totalReservations: 523,
      activeReservations: 45,
      completedReservations: 465,
      cancelledReservations: 13
    };

    this.roomStats = {
      totalRooms: 24,
      availableRooms: 18,
      occupiedRooms: 5,
      maintenanceRooms: 1
    };
  }

  /**
   * Carga las actividades recientes desde el backend
   */
  loadRecentActivities(): void {
    this.isLoadingActivities = true;
    console.log('=== Iniciando carga de actividades ===');
    
    this.actividadService.obtenerActividadReciente(10).subscribe({
      next: (actividades: ActividadReciente[]) => {
        console.log('✅ Actividades recibidas del backend:', actividades);
        console.log('📊 Cantidad de actividades:', actividades?.length);
        
        if (!actividades || actividades.length === 0) {
          console.warn('⚠️ Array de actividades vacío o nulo');
          this.recentActivities = [];
          this.isLoadingActivities = false;
          return;
        }
        
        this.recentActivities = actividades.map((act, index) => {
          const mapped = {
            id: index + 1,
            type: this.mapearTipo(act.tipo),
            description: act.descripcion,
            timestamp: this.formatearFecha(act.fecha),
            icon: act.icono,
            badge: act.badge || undefined
          };
          console.log(`🔄 Actividad ${index + 1} mapeada:`, mapped);
          return mapped;
        });
        
        console.log('✨ ARRAY FINAL recentActivities:', this.recentActivities);
        console.log('📏 Tamaño del array:', this.recentActivities.length);
        this.isLoadingActivities = false;
        this.cdr.detectChanges();
        console.log('🔄 Detección de cambios forzada');
      },
      error: (error) => {
        console.error('❌ Error al cargar actividades:', error);
        this.isLoadingActivities = false;
        this.cargarActividadesDePrueba();
      }
    });
  }

  /**
   * Mapea el tipo de actividad del backend al tipo del frontend
   */
  private mapearTipo(tipo: string): 'user' | 'reservation' | 'room' | 'report' {
    const mapeo: Record<string, 'user' | 'reservation' | 'room' | 'report'> = {
      'USUARIO': 'user',
      'TUTORIA': 'room',
      'RESERVA': 'reservation'
    };
    return mapeo[tipo] || 'report';
  }

  /**
   * Formatea la fecha a un formato legible
   */
  private formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    // Formato DD/MM/YYYY HH:mm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /**
   * Carga actividades de prueba en caso de error
   */
  private cargarActividadesDePrueba(): void {
    this.recentActivities = [
      {
        id: 1,
        type: 'user',
        description: 'Nuevo usuario registrado: Juan Pérez',
        timestamp: '2024-01-15 10:30',
        icon: 'bi-person-plus'
      },
      {
        id: 2,
        type: 'reservation',
        description: 'Nueva reserva para Sala 301',
        timestamp: '2024-01-15 09:45',
        icon: 'bi-calendar-check'
      },
      {
        id: 3,
        type: 'room',
        description: 'Sala 205 marcada en mantenimiento',
        timestamp: '2024-01-15 08:20',
        icon: 'bi-wrench'
      },
      {
        id: 4,
        type: 'report',
        description: 'Reporte mensual generado',
        timestamp: '2024-01-14 18:00',
        icon: 'bi-file-earmark-text'
      },
      {
        id: 5,
        type: 'user',
        description: 'Usuario bloqueado: Carlos Ruiz',
        timestamp: '2024-01-14 16:30',
        icon: 'bi-person-x'
      }
    ];
  }

  /**
   * Obtiene la clase CSS según el tipo de actividad
   */
  getActivityClass(type: string): string {
    const classes: Record<string, string> = {
      'user': 'activity-user',
      'reservation': 'activity-reservation',
      'room': 'activity-room',
      'report': 'activity-report'
    };
    return classes[type] || '';
  }
}

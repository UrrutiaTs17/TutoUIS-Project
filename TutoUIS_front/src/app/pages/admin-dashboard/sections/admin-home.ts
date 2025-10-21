import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {
  currentPageTitle: string = 'Panel de Administración';

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
   * Carga las actividades recientes
   */
  private loadRecentActivities(): void {
    // TODO: Implementar llamada al servicio
    // Por ahora, datos de ejemplo
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

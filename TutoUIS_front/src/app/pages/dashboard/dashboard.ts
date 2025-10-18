import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Interfaces para tipar los datos
interface Reservation {
  id: number;
  roomName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}

interface FavoriteRoom {
  id: number;
  name: string;
  building: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // Información del usuario
  userName: string = 'Usuario';
  userEmail: string = 'usuario@uis.edu.co';
  userInitials: string = 'U';

  // Control de navegación
  activeSection: string = 'inicio';
  currentPageTitle: string = 'Dashboard';
  isSidebarOpen: boolean = false;

  constructor(private authService: AuthService) {}

  // Estadísticas
  activeReservationsCount: number = 3;
  upcomingReservationsCount: number = 5;
  completedReservationsCount: number = 12;
  favoriteRoomsCount: number = 4;
  todayReservations: number = 2;

  // Listas de datos
  upcomingReservationsList: Reservation[] = [
    {
      id: 1,
      roomName: 'Sala de Estudio B-302',
      date: '15 de Oct, 2025',
      time: '14:00 - 16:00',
      status: 'confirmed'
    },
    {
      id: 2,
      roomName: 'Cubículo Individual 15',
      date: '16 de Oct, 2025',
      time: '10:00 - 12:00',
      status: 'confirmed'
    },
    {
      id: 3,
      roomName: 'Sala Grupal A-105',
      date: '18 de Oct, 2025',
      time: '15:00 - 17:00',
      status: 'pending'
    }
  ];

  favoriteRoomsList: FavoriteRoom[] = [
    { id: 1, name: 'Sala B-302', building: 'Edificio B' },
    { id: 2, name: 'Cubículo 15', building: 'Biblioteca' },
    { id: 3, name: 'Sala A-105', building: 'Edificio A' },
    { id: 4, name: 'Sala C-201', building: 'Edificio C' }
  ];

  ngOnInit(): void {
    // Inicializar componente
    this.updatePageTitle();
    
    // Obtener información del usuario logeado
    const userData = this.authService.getUserData();
    if (userData && userData.codigo) {
      // Usar el código como usuario por defecto
      this.userName = userData.codigo;
      this.userEmail = `${userData.codigo}@uis.edu.co`;
      this.userInitials = this.getUserInitials(this.userName);
      
      // Intentar obtener el perfil completo
      this.authService.getUserProfile().subscribe(
        (profile: any) => {
          if (profile.nombre || profile.apellido) {
            this.userName = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
            this.userEmail = profile.correo || this.userEmail;
            this.userInitials = this.getUserInitials(this.userName);
          }
        },
        (error) => {
          console.warn('No se pudo cargar el perfil completo:', error);
          // Se mantienen los valores por defecto
        }
      );
    } else {
      this.userInitials = this.getUserInitials(this.userName);
    }
  }

  /**
   * Cambia la sección activa del dashboard
   */
  setActiveSection(section: string): void {
    this.activeSection = section;
    this.updatePageTitle();
    
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth < 992) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Actualiza el título de la página según la sección activa
   */
  updatePageTitle(): void {
    const titles: { [key: string]: string } = {
      'inicio': 'Página Principal',
      'nueva-reserva': 'Nueva Reserva',
      'mis-reservas': 'Mis Reservas',
      'historial': 'Historial',
      'perfil': 'Mi Perfil',
      'configuracion': 'Configuración'
    };
    this.currentPageTitle = titles[this.activeSection] || 'Dashboard';
  }

  /**
   * Obtiene las iniciales del nombre del usuario
   */
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * Alterna la visibilidad del sidebar en móvil
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Aquí irá la lógica de logout
      console.log('Cerrando sesión...');
      // Redirigir al login
      // this.router.navigate(['/login']);
    }
  }
}

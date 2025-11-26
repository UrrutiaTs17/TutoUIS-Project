import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit {
  // Información del usuario
  userName: string = 'Usuario';
  userEmail: string = 'usuario@uis.edu.co';
  userInitials: string = 'U';
  userRole: number | null = null;

  // Control de navegación
  currentPageTitle: string = 'Panel de Usuario';
  isSidebarOpen: boolean = false;
  isLoggingOut: boolean = false; // Prevenir múltiples clicks

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userData = this.authService.getUserData();
    if (userData && userData.codigo) {
      // Primero intentar usar el perfil cacheado
      const cachedProfile = this.authService.getCachedProfile();
      if (cachedProfile && (cachedProfile.nombre || cachedProfile.apellido)) {
        this.userName = `${cachedProfile.nombre || ''} ${cachedProfile.apellido || ''}`.trim();
        this.userEmail = cachedProfile.correo || `${userData.codigo}@uis.edu.co`;
        this.userInitials = this.getUserInitials(this.userName);
        this.userRole = cachedProfile.id_rol || null;
        console.log('Perfil cargado desde caché:', this.userName, 'role=', this.userRole);
      } else {
        // Si no hay perfil cacheado, usar el código como fallback
        this.userName = userData.codigo;
        this.userEmail = `${userData.codigo}@uis.edu.co`;
        this.userInitials = this.getUserInitials(this.userName);
        
        // Intentar obtener el perfil completo del servidor
        this.authService.getUserProfile().subscribe(
          (profile: any) => {
            console.log('Respuesta del servidor:', profile);
            if (profile && (profile.nombre || profile.apellido)) {
              this.userName = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
              this.userEmail = profile.correo || this.userEmail;
              this.userInitials = this.getUserInitials(this.userName);
              this.userRole = profile.id_rol || null;
              console.log('Perfil cargado desde servidor:', this.userName, 'role=', this.userRole);
            } else {
              console.log('El perfil no contiene nombre o apellido:', profile);
            }
          },
          (error) => {
            console.error('Error al cargar el perfil completo:', error);
            console.error('Detalles del error:', error.error || error.message);
            // Mantener los valores por defecto (código)
          }
        );
      }
    }
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    // Prevenir múltiples ejecuciones
    if (this.isLoggingOut) {
      console.log('DashboardLayout - Ya hay un proceso de logout en curso');
      return;
    }

    console.log('DashboardLayout - Iniciando proceso de cierre de sesión...');
    this.isLoggingOut = true;

    // Sin confirmación - cierre directo
    console.log('DashboardLayout - Cerrando sesión directamente...');
    this.authService.logout();
    console.log('DashboardLayout - Navegando a /login...');
    
    this.router.navigate(['/login']).then(() => {
      console.log('DashboardLayout - Navegación completada');
      this.isLoggingOut = false;
      // Recargar la página para limpiar cualquier estado residual
      window.location.reload();
    }).catch((error) => {
      console.error('DashboardLayout - Error en navegación:', error);
      this.isLoggingOut = false;
      // Forzar recarga si falla la navegación
      window.location.href = '/login';
    });
  }
}

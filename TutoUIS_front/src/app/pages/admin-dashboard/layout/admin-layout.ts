import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  // Información del administrador
  adminName: string = 'Administrador';
  adminEmail: string = 'admin@uis.edu.co';
  adminInitials: string = 'AD';
  adminCode: string = '';
  isSidebarOpen: boolean = false;
  isLoggingOut: boolean = false; // Prevenir múltiples clicks

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AdminLayout - Iniciando...');
    
    // Verificar si el usuario es administrador
    if (!this.authService.isAdmin()) {
      console.warn('Acceso denegado: el usuario no es administrador');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Cargar datos del usuario
    this.loadUserData();
  }

  /**
   * Carga los datos del usuario (primero del caché, luego del backend)
   */
  private loadUserData(): void {
    console.log('AdminLayout - Cargando datos del usuario...');
    
    // 1. Intentar usar el perfil cacheado primero (más rápido)
    const cachedProfile = this.authService.getCachedProfile();
    console.log('AdminLayout - Perfil cacheado:', cachedProfile);
    
    if (cachedProfile && cachedProfile.nombre && cachedProfile.apellido) {
      // Usar datos del caché
      this.adminName = `${cachedProfile.nombre} ${cachedProfile.apellido}`;
      this.adminEmail = cachedProfile.correo;
      this.adminCode = cachedProfile.codigo;
      this.adminInitials = this.getInitials(cachedProfile.nombre, cachedProfile.apellido);
      console.log('AdminLayout - Datos cargados del caché:', {
        nombre: this.adminName,
        correo: this.adminEmail,
        iniciales: this.adminInitials
      });
    } else {
      // 2. Si no hay caché o está incompleto, usar código como fallback
      const userData = this.authService.getUserData();
      console.log('AdminLayout - UserData:', userData);
      
      if (userData) {
        this.adminCode = userData.codigo;
        this.adminName = userData.codigo;
        this.adminEmail = `${userData.codigo}@uis.edu.co`;
        this.adminInitials = userData.codigo.substring(0, 2).toUpperCase();
      }
      
      // 3. Intentar cargar el perfil completo del backend
      console.log('AdminLayout - Cargando perfil del backend...');
      this.authService.getUserProfile().subscribe({
        next: (profile) => {
          console.log('AdminLayout - Perfil recibido del backend:', profile);
          if (profile && profile.nombre && profile.apellido) {
            this.adminName = `${profile.nombre} ${profile.apellido}`;
            this.adminEmail = profile.correo;
            this.adminCode = profile.codigo;
            this.adminInitials = this.getInitials(profile.nombre, profile.apellido);
            console.log('AdminLayout - Datos actualizados del backend:', {
              nombre: this.adminName,
              correo: this.adminEmail,
              iniciales: this.adminInitials
            });
          }
        },
        error: (error) => {
          console.error('AdminLayout - Error al cargar perfil del backend:', error);
          console.log('AdminLayout - Usando código como fallback');
          // Mantener el código como fallback si falla la llamada
        }
      });
    }
  }

  /**
   * Obtiene las iniciales del nombre completo
   */
  private getInitials(nombre: string, apellido: string): string {
    const firstInitial = nombre?.charAt(0).toUpperCase() || '';
    const lastInitial = apellido?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  /**
   * Alterna la visibilidad del sidebar en móvil
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Cierra la sesión
   */
  logout(): void {
    // Prevenir múltiples ejecuciones
    if (this.isLoggingOut) {
      console.log('AdminLayout - Ya hay un proceso de logout en curso');
      return;
    }

    console.log('AdminLayout - Iniciando proceso de cierre de sesión...');
    this.isLoggingOut = true;

    // Sin confirmación - cierre directo
    console.log('AdminLayout - Cerrando sesión directamente...');
    this.authService.logout();
    console.log('AdminLayout - Navegando a /login...');
    
    this.router.navigate(['/login']).then(() => {
      console.log('AdminLayout - Navegación completada');
      this.isLoggingOut = false;
      // Recargar la página para limpiar cualquier estado residual
      window.location.reload();
    }).catch((error) => {
      console.error('AdminLayout - Error en navegación:', error);
      this.isLoggingOut = false;
      // Forzar recarga si falla la navegación
      window.location.href = '/login';
    });
  }
}

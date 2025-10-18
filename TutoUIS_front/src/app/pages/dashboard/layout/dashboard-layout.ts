import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Dashboard con Sidebar Layout -->
    <div class="dashboard-layout" [class.sidebar-open]="isSidebarOpen">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <img
            src="/TutoUIS_Logo.png"
            alt="Logo TutoUIS"
            class="logo-sidebar"
          />
        </div>

        <div class="user-profile">
          <div class="avatar">{{ userInitials }}</div>
          <h6 class="user-name">{{ userName }}</h6>
          <small class="user-email">{{ userEmail }}</small>
        </div>

        <nav class="nav-menu">
          <a class="nav-item" [routerLink]="'/dashboard'" [routerLinkActive]="'active'" [routerLinkActiveOptions]="{ exact: true }">
            <i class="bi bi-house-door"></i>
            <span>Inicio</span>
          </a>
          <a class="nav-item" [routerLink]="'/dashboard/reservation'" [routerLinkActive]="'active'">
            <i class="bi bi-calendar-plus"></i>
            <span>Nueva Reserva</span>
          </a>
          <a class="nav-item" [routerLink]="'/dashboard/reservations'" [routerLinkActive]="'active'">
            <i class="bi bi-list-ul"></i>
            <span>Mis Reservas</span>
          </a>
          <a class="nav-item" [routerLink]="'/dashboard/history'" [routerLinkActive]="'active'">
            <i class="bi bi-clock-history"></i>
            <span>Historial</span>
          </a>
          <a class="nav-item" [routerLink]="'/dashboard/profile'" [routerLinkActive]="'active'">
            <i class="bi bi-person"></i>
            <span>Mi Perfil</span>
          </a>
          <a class="nav-item" [routerLink]="'/dashboard/settings'" [routerLinkActive]="'active'">
            <i class="bi bi-gear"></i>
            <span>Configuración</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="btn btn-outline-light btn-sm w-100" (click)="logout()">
            <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Bar -->
        <div class="top-bar">
          <div class="top-bar-left">
            <button class="btn btn-link mobile-menu-toggle" (click)="toggleSidebar()">
              <i class="bi bi-list"></i>
            </button>
            <h3 class="page-title">{{ currentPageTitle }}</h3>
          </div>
          <div class="top-bar-right">
            <button class="btn btn-icon" title="Notificaciones">
              <i class="bi bi-bell"></i>
              <span class="notification-badge">3</span>
            </button>
            <button class="btn btn-icon" title="Ayuda">
              <i class="bi bi-question-circle"></i>
            </button>
          </div>
        </div>

        <!-- Content Area - Router Outlet -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit {
  // Información del usuario
  userName: string = 'Usuario';
  userEmail: string = 'usuario@uis.edu.co';
  userInitials: string = 'U';

  // Control de navegación
  currentPageTitle: string = 'Dashboard';
  isSidebarOpen: boolean = false;

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
        }
      );
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
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}

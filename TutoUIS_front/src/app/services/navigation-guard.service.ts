import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationGuardService {
  
  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.setupNavigationListener();
    }
  }

  private setupNavigationListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Verificar autenticación en cada navegación
        this.checkAuthenticationOnNavigation(event.url);
      });
  }

  private checkAuthenticationOnNavigation(url: string): void {
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/', '/login'];
    const isPublicRoute = publicRoutes.some(route => url === route || url.startsWith(route + '/'));
    
    // Si no es una ruta pública y el usuario no está autenticado, redirigir al login
    if (!isPublicRoute && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: url } 
      });
    }
  }
}

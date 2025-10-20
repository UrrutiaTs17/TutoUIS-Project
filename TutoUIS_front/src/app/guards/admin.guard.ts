import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar si es administrador
  if (!authService.isAdmin()) {
    console.warn('Acceso denegado: el usuario no es administrador');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

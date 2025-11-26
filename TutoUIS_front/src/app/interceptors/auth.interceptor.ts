import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para agregar el token JWT a todas las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificar si estamos en el navegador (no en SSR)
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  
  // Obtener el token del localStorage solo si estamos en el navegador
  const token = isBrowser ? localStorage.getItem('auth_token') : null;
  
  // Si existe el token, clonamos la petición y agregamos el header de autorización
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('🔐 Token agregado a la petición:', req.url);
    return next(clonedRequest);
  }
  
  // Si no hay token, enviamos la petición original
  console.log('⚠️ Petición sin token:', req.url);
  return next(req);
};

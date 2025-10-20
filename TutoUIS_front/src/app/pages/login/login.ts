import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  mostrarContrasena = false;
  usuario: string = '';
  contrasena: string = '';
  cargando: boolean = false;
  errorLogin: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  onLogin() {
    this.errorLogin = null;
    
    if (!this.usuario || !this.contrasena) {
      this.errorLogin = 'Por favor ingrese usuario y contraseña.';
      return;
    }

    this.cargando = true;

    const loginRequest: LoginRequest = {
      codigo: this.usuario,
      contrasena: this.contrasena
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.cargando = false;
        this.errorLogin = null;
        console.log('Login exitoso:', response);
        
        // Cargar y cachear el perfil del usuario después del login
        this.authService.getUserProfile().subscribe({
          next: (profile) => {
            // Perfil cacheado, redirigir según el rol
            if (profile.id_rol === 1) {
              // Usuario administrador
              this.router.navigate(['/admin-dashboard']);
            } else {
              // Usuario regular
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            console.warn('Advertencia: No se pudo cargar el perfil, pero continuando:', error);
            // Continuamos con el dashboard regular si hay error
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error en login:', error);
        
        if (error.status === 401) {
          this.errorLogin = error.error || 'Usuario o contraseña incorrectos.';
        } else if (error.status === 0) {
          this.errorLogin = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
        } else {
          this.errorLogin = 'Error del servidor. Intente nuevamente.';
        }
      }
    });
  }
}



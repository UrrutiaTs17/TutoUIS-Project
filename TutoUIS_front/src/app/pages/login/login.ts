import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 necesario para ngClass
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 agrega esto si no está
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  mostrarContrasena = false;
  usuario: string = '';
  contrasena: string = '';
  cargando: boolean = false;
  errorLogin: string | null = null;

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
    // Simulación de petición de login (reemplaza por tu lógica real)
    setTimeout(() => {
      if (this.usuario === 'estudiante' && this.contrasena === '1234') {
        // Login exitoso (aquí iría la navegación o lógica real)
        this.errorLogin = null;
        alert('¡Bienvenido!');
      } else {
        this.errorLogin = 'Usuario o contraseña incorrectos.';
      }
      this.cargando = false;
    }, 1500);
  }
}



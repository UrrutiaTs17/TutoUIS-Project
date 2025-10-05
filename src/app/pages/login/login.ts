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

  togglePassword() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}



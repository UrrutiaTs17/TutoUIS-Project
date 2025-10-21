import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../services/admin.service';

interface CreateUserForm {
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono: string;
  id_rol: number;
  id_carrera: number | null;
  activo: boolean;
}

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-modal.html',
  styleUrl: './create-user-modal.css'
})
export class CreateUserModal {
  @Output() userCreated = new EventEmitter<Usuario>();
  @Output() modalClosed = new EventEmitter<void>();

  showModal = false;
  isSubmitting = false;
  errorMessage = '';
  
  formData: CreateUserForm = {
    nombre: '',
    apellido: '',
    codigo: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
    id_rol: 2, // Por defecto: Estudiante
    id_carrera: null,
    activo: true
  };

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Estudiante' },
    { id: 3, nombre: 'Profesor' },
    { id: 4, nombre: 'Personal' }
  ];

  // Lista de carreras (puedes modificar según tu base de datos)
  carreras = [
    { id: 1, nombre: 'Ingeniería de Sistemas' },
    { id: 2, nombre: 'Ingeniería Industrial' },
    { id: 3, nombre: 'Ingeniería Mecánica' },
    { id: 4, nombre: 'Ingeniería Civil' },
    { id: 5, nombre: 'Ingeniería Electrónica' },
    { id: 6, nombre: 'Ingeniería Química' },
    { id: 7, nombre: 'Medicina' },
    { id: 8, nombre: 'Derecho' }
  ];

  constructor(private adminService: AdminService) {}

  /**
   * Abre el modal
   */
  open(): void {
    this.showModal = true;
    this.resetForm();
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.showModal = false;
    this.resetForm();
    this.modalClosed.emit();
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.formData = {
      nombre: '',
      apellido: '',
      codigo: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: '',
      telefono: '',
      id_rol: 2,
      id_carrera: null,
      activo: true
    };
    this.errorMessage = '';
  }

  /**
   * Valida el formulario
   */
  validateForm(): boolean {
    // Validar campos requeridos
    if (!this.formData.nombre || !this.formData.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }

    if (!this.formData.apellido || !this.formData.apellido.trim()) {
      this.errorMessage = 'El apellido es requerido';
      return false;
    }

    if (!this.formData.codigo || !this.formData.codigo.trim()) {
      this.errorMessage = 'El código es requerido';
      return false;
    }

    // Validar formato de código (puedes ajustar según tus reglas)
    if (this.formData.codigo.length < 4) {
      this.errorMessage = 'El código debe tener al menos 4 caracteres';
      return false;
    }

    if (!this.formData.correo || !this.formData.correo.trim()) {
      this.errorMessage = 'El correo es requerido';
      return false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.correo)) {
      this.errorMessage = 'El formato del correo no es válido';
      return false;
    }

    if (!this.formData.contrasena || !this.formData.contrasena.trim()) {
      this.errorMessage = 'La contraseña es requerida';
      return false;
    }

    // Validar longitud de contraseña
    if (this.formData.contrasena.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    // Validar que las contraseñas coincidan
    if (this.formData.contrasena !== this.formData.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    // Validar teléfono si se proporciona
    if (this.formData.telefono && this.formData.telefono.trim()) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(this.formData.telefono)) {
        this.errorMessage = 'El formato del teléfono no es válido';
        return false;
      }
    }

    return true;
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    this.errorMessage = '';

    // Validar formulario
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Preparar datos para enviar
    const userData: any = {
      nombre: this.formData.nombre.trim(),
      apellido: this.formData.apellido.trim(),
      codigo: this.formData.codigo.trim(),
      correo: this.formData.correo.trim().toLowerCase(),
      contrasena: this.formData.contrasena,
      telefono: this.formData.telefono.trim() || undefined,
      id_rol: this.formData.id_rol,
      id_carrera: this.formData.id_carrera || undefined,
      activo: this.formData.activo,
      bloqueado: false
    };

    // Llamar al servicio para crear usuario
    this.adminService.createUser(userData).subscribe({
      next: (nuevoUsuario) => {
        console.log('Usuario creado exitosamente:', nuevoUsuario);
        this.isSubmitting = false;
        this.userCreated.emit(nuevoUsuario);
        this.close();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.isSubmitting = false;
        
        // Manejar diferentes tipos de errores
        if (error.status === 400) {
          this.errorMessage = error.error || 'Datos inválidos. Verifica la información e intenta nuevamente.';
        } else if (error.status === 409) {
          this.errorMessage = 'El código o correo ya están registrados.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else {
          this.errorMessage = 'Error al crear usuario. Por favor, intenta nuevamente.';
        }
      }
    });
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(field: string): boolean {
    return this.errorMessage.toLowerCase().includes(field.toLowerCase());
  }
}

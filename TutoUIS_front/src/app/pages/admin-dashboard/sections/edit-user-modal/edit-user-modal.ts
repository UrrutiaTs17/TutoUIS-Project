import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario, Rol } from '../../../../services/admin.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user-modal.html',
  styleUrls: ['./edit-user-modal.css']
})
export class EditUserModal implements OnInit {
  @ViewChild('editUserModal') modalElement!: ElementRef;
  @Output() userUpdated = new EventEmitter<Usuario>();
  
  isOpen = false;
  isSubmitting = false;
  errorMessage = '';
  
  // Roles disponibles
  roles: Rol[] = [];
  loadingRoles: boolean = false;
  
  // Datos del formulario
  formData = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    codigo: '',
    correo: '',
    telefono: '',
    id_rol: 2,
    id_carrera: 1,
    activo: true,
    bloqueado: false
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Cargar roles al inicializar el componente
    this.loadRoles();
  }

  /**
   * Carga los roles desde el backend
   */
  loadRoles(): void {
    this.loadingRoles = true;
    this.adminService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
        console.log('Roles cargados en modal de edición:', roles);
      },
      error: (error) => {
        console.error('Error al cargar roles en modal de edición:', error);
        this.loadingRoles = false;
        // En caso de error, usar roles por defecto
        this.roles = [
          { idRol: 1, nombre: 'Administrador', descripcion: 'Administrador del sistema' },
          { idRol: 2, nombre: 'Tutor', descripcion: 'Tutor académico' },
          { idRol: 3, nombre: 'Estudiante', descripcion: 'Estudiante de la universidad' }
        ];
      }
    });
  }

  /**
   * Abre el modal con los datos del usuario a editar
   */
  open(usuario: Usuario): void {
    this.formData = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      codigo: usuario.codigo,
      correo: usuario.correo,
      telefono: usuario.telefono,
      id_rol: usuario.id_rol,
      id_carrera: usuario.id_carrera,
      activo: usuario.activo,
      bloqueado: usuario.bloqueado
    };
    this.errorMessage = '';
    this.isOpen = true;
    
    // Mostrar modal con Bootstrap
    setTimeout(() => {
      const modal = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
      modal.show();
    }, 100);
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.isOpen = false;
    const modal = (window as any).bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) {
      modal.hide();
    }
    this.resetForm();
  }

  /**
   * Resetea el formulario
   */
  private resetForm(): void {
    this.formData = {
      id_usuario: 0,
      nombre: '',
      apellido: '',
      codigo: '',
      correo: '',
      telefono: '',
      id_rol: 2,
      id_carrera: 1,
      activo: true,
      bloqueado: false
    };
    this.errorMessage = '';
  }

  /**
   * Valida el formulario
   */
  private validateForm(): boolean {
    if (!this.formData.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    if (!this.formData.apellido.trim()) {
      this.errorMessage = 'El apellido es requerido';
      return false;
    }
    if (!this.formData.codigo.trim()) {
      this.errorMessage = 'El código es requerido';
      return false;
    }
    if (!this.formData.correo.trim()) {
      this.errorMessage = 'El correo es requerido';
      return false;
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.correo)) {
      this.errorMessage = 'El correo no tiene un formato válido';
      return false;
    }

    return true;
  }

  /**
   * Envía el formulario para actualizar el usuario
   */
  onSubmit(): void {
    if (this.isSubmitting) return;

    // Validar formulario
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Preparar datos para enviar
    const updateData: Partial<Usuario> = {
      nombre: this.formData.nombre.trim(),
      apellido: this.formData.apellido.trim(),
      codigo: this.formData.codigo.trim(),
      correo: this.formData.correo.trim(),
      telefono: this.formData.telefono.trim(),
      id_rol: this.formData.id_rol,
      id_carrera: this.formData.id_carrera,
      activo: this.formData.activo,
      bloqueado: this.formData.bloqueado
    };

    console.log('Actualizando usuario:', this.formData.id_usuario, updateData);

    this.adminService.updateUser(this.formData.id_usuario, updateData).subscribe({
      next: (usuario) => {
        console.log('Usuario actualizado exitosamente:', usuario);
        this.userUpdated.emit(usuario);
        this.close();
        // Mostrar mensaje de éxito
        alert('✅ Usuario actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.isSubmitting = false;
        
        if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos. Verifica la información.';
        } else if (error.status === 409) {
          this.errorMessage = 'El código o correo ya están en uso por otro usuario.';
        } else if (error.status === 404) {
          this.errorMessage = 'Usuario no encontrado.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          this.errorMessage = 'Error al actualizar el usuario. Intenta nuevamente.';
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}

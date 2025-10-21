import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Usuario } from '../../../services/admin.service';
import { CreateUserModal } from '../../../components/create-user-modal/create-user-modal';
import { EditUserModal } from './edit-user-modal';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateUserModal, EditUserModal],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  @ViewChild(CreateUserModal) createUserModal!: CreateUserModal;
  @ViewChild(EditUserModal) editUserModal!: EditUserModal;

  // Gestión de usuarios
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loadingUsers: boolean = false;
  searchTerm: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('AdminUsers - ngOnInit');
    this.loadUsers();
    
    // Timeout de seguridad: si después de 15 segundos sigue cargando, forzar detención
    setTimeout(() => {
      if (this.loadingUsers) {
        console.error('AdminUsers - TIMEOUT: Carga tomó más de 15 segundos');
        this.loadingUsers = false;
        this.cdr.detectChanges(); // Force change detection
        alert('La carga de usuarios está tardando demasiado. Por favor, verifica que el backend esté corriendo en http://localhost:8080');
      }
    }, 15000);
  }

  /**
   * Carga la lista de todos los usuarios
   */
  loadUsers(): void {
    console.log('AdminUsers - Iniciando carga de usuarios...');
    this.loadingUsers = true;
    
    this.adminService.getAllUsers().subscribe({
      next: (usuarios) => {
        console.log('AdminUsers - Usuarios recibidos:', usuarios.length, usuarios);
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.loadingUsers = false;
        this.cdr.detectChanges(); // Force change detection
        console.log('AdminUsers - Estado después de cargar:', {
          usuarios: this.usuarios.length,
          filtrados: this.usuariosFiltrados.length,
          loading: this.loadingUsers
        });
      },
      error: (error) => {
        console.error('AdminUsers - Error al cargar usuarios:', error);
        
        let errorMessage = 'Error al cargar la lista de usuarios.\n\n';
        
        if (error.status === 0) {
          errorMessage += '❌ No se pudo conectar con el servidor.\n';
          errorMessage += 'Verifica que el backend esté ejecutándose en http://localhost:8080\n\n';
          errorMessage += 'Pasos para solucionar:\n';
          errorMessage += '1. Abre una terminal en la carpeta del backend\n';
          errorMessage += '2. Ejecuta: mvn spring-boot:run\n';
          errorMessage += '3. Espera a que aparezca "Started Application..."\n';
          errorMessage += '4. Recarga esta página';
        } else if (error.status === 403) {
          errorMessage += '❌ No tienes permisos para ver esta información.\n';
          errorMessage += 'Verifica que tu usuario sea administrador (id_rol = 1)';
        } else if (error.status === 401) {
          errorMessage += '❌ Tu sesión ha expirado.\n';
          errorMessage += 'Por favor, inicia sesión nuevamente.';
        } else if (error.error && error.error.message) {
          errorMessage += `❌ ${error.error.message}`;
        } else {
          errorMessage += `❌ Error ${error.status}: ${error.statusText || 'Error desconocido'}`;
        }
        
        alert(errorMessage);
        this.loadingUsers = false;
        this.cdr.detectChanges(); // Force change detection
      },
      complete: () => {
        console.log('AdminUsers - Observable completado');
        this.loadingUsers = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  /**
   * Filtra la lista de usuarios según los criterios de búsqueda
   */
  filterUsers(): void {
    let filtered = [...this.usuarios];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.nombre.toLowerCase().includes(term) ||
        u.apellido.toLowerCase().includes(term) ||
        u.codigo.toLowerCase().includes(term) ||
        u.correo.toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (this.filterRole !== 'all') {
      if (this.filterRole === 'admin') {
        filtered = filtered.filter(u => u.id_rol === 1);
      } else if (this.filterRole === 'user') {
        filtered = filtered.filter(u => u.id_rol !== 1);
      }
    }

    // Filtro por estado
    if (this.filterStatus !== 'all') {
      if (this.filterStatus === 'active') {
        filtered = filtered.filter(u => u.activo && !u.bloqueado);
      } else if (this.filterStatus === 'inactive') {
        filtered = filtered.filter(u => !u.activo);
      } else if (this.filterStatus === 'blocked') {
        filtered = filtered.filter(u => u.bloqueado);
      }
    }

    this.usuariosFiltrados = filtered;
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getUserFullName(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  /**
   * Obtiene el nombre del rol
   */
  getRoleName(idRol: number): string {
    return idRol === 1 ? 'Administrador' : 'Usuario';
  }

  /**
   * Obtiene la clase CSS para el badge del rol
   */
  getRoleBadgeClass(idRol: number): string {
    return idRol === 1 ? 'bg-primary' : 'bg-secondary';
  }

  /**
   * Obtiene el estado del usuario como texto
   */
  getUserStatus(usuario: Usuario): string {
    if (usuario.bloqueado) return 'Bloqueado';
    if (!usuario.activo) return 'Inactivo';
    return 'Activo';
  }

  /**
   * Obtiene la clase CSS para el badge del estado
   */
  getStatusBadgeClass(usuario: Usuario): string {
    if (usuario.bloqueado) return 'bg-danger';
    if (!usuario.activo) return 'bg-warning';
    return 'bg-success';
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateUserModal(): void {
    this.createUserModal.open();
  }

  /**
   * Abre el modal para editar un usuario
   */
  openEditUserModal(usuario: Usuario): void {
    this.editUserModal.open(usuario);
  }

  /**
   * Maneja el evento de usuario creado exitosamente
   */
  onUserCreated(newUser: Usuario): void {
    console.log('Usuario creado:', newUser);
    // Recargar la lista de usuarios para mostrar el nuevo usuario
    this.loadUsers();
  }

  /**
   * Maneja el evento de usuario actualizado exitosamente
   */
  onUserUpdated(updatedUser: Usuario): void {
    console.log('Usuario actualizado:', updatedUser);
    // Actualizar el usuario en la lista local
    const index = this.usuarios.findIndex(u => u.id_usuario === updatedUser.id_usuario);
    if (index !== -1) {
      this.usuarios[index] = updatedUser;
      this.filterUsers();
      this.cdr.detectChanges();
    }
  }

  /**
   * Alterna el estado de bloqueo de un usuario
   */
  toggleBlockUser(usuario: Usuario): void {
    const action = usuario.bloqueado ? 'desbloquear' : 'bloquear';
    
    if (!confirm(`¿Estás seguro de que deseas ${action} a ${usuario.nombre} ${usuario.apellido}?`)) {
      return;
    }

    this.loadingUsers = true;
    
    const serviceCall = usuario.bloqueado 
      ? this.adminService.unblockUser(usuario.id_usuario)
      : this.adminService.blockUser(usuario.id_usuario);

    serviceCall.subscribe({
      next: (updatedUser) => {
        console.log(`Usuario ${action}do:`, updatedUser);
        
        // Actualizar el usuario en la lista
        const index = this.usuarios.findIndex(u => u.id_usuario === usuario.id_usuario);
        if (index !== -1) {
          this.usuarios[index] = updatedUser;
          this.filterUsers();
        }
        
        this.loadingUsers = false;
        this.cdr.detectChanges();
        
        alert(`✅ Usuario ${action}do exitosamente`);
      },
      error: (error) => {
        console.error(`Error al ${action} usuario:`, error);
        this.loadingUsers = false;
        this.cdr.detectChanges();
        
        let errorMessage = `Error al ${action} usuario. `;
        if (error.status === 0) {
          errorMessage += 'No se pudo conectar con el servidor.';
        } else if (error.status === 403) {
          errorMessage += 'No tiene permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage += 'Usuario no encontrado.';
        } else {
          errorMessage += 'Por favor, intente nuevamente.';
        }
        
        alert(errorMessage);
      }
    });
  }

  /**
   * Elimina un usuario del sistema
   */
  deleteUser(usuario: Usuario): void {
    const confirmMessage = `⚠️ ¿Estás seguro de que deseas ELIMINAR a ${usuario.nombre} ${usuario.apellido}?\n\n` +
                          `Esta acción NO se puede deshacer.\n\n` +
                          `Usuario: ${usuario.codigo}\n` +
                          `Correo: ${usuario.correo}`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    this.loadingUsers = true;

    this.adminService.deleteUser(usuario.id_usuario).subscribe({
      next: () => {
        console.log('Usuario eliminado:', usuario.id_usuario);
        
        // Remover el usuario de la lista
        this.usuarios = this.usuarios.filter(u => u.id_usuario !== usuario.id_usuario);
        this.filterUsers();
        
        this.loadingUsers = false;
        this.cdr.detectChanges();
        
        alert('✅ Usuario eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.loadingUsers = false;
        this.cdr.detectChanges();
        
        let errorMessage = 'Error al eliminar usuario. ';
        if (error.status === 0) {
          errorMessage += 'No se pudo conectar con el servidor.';
        } else if (error.status === 403) {
          errorMessage += 'No tiene permisos para realizar esta acción.';
        } else if (error.status === 404) {
          errorMessage += 'Usuario no encontrado.';
        } else {
          errorMessage += 'Por favor, intente nuevamente.';
        }
        
        alert(errorMessage);
      }
    });
  }
}

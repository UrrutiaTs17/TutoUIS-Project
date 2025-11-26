import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Usuario, Rol } from '../../services/admin.service';
import { CreateUserModal } from '../../components/create-user-modal/create-user-modal';

// Interfaces para tipar los datos
interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  newUsersThisMonth: number;
}

interface ReservationStats {
  totalReservations: number;
  activeReservations: number;
  completedReservations: number;
  cancelledReservations: number;
}

interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'reservation' | 'room' | 'report';
  description: string;
  timestamp: string;
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateUserModal],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
    // Datos para gráficos de reportes y estadísticas
    reservasPorDiaData: Array<{ dia: string, cantidad: number }> = [
      { dia: 'Lun', cantidad: 32 },
      { dia: 'Mar', cantidad: 45 },
      { dia: 'Mié', cantidad: 38 },
      { dia: 'Jue', cantidad: 52 },
      { dia: 'Vie', cantidad: 41 },
      { dia: 'Sáb', cantidad: 28 },
      { dia: 'Dom', cantidad: 12 }
    ];

    estadoReservasData: Array<{ estado: string, porcentaje: number }> = [
      { estado: 'Completadas', porcentaje: 75 },
      { estado: 'Reservadas', porcentaje: 11 },
      { estado: 'Pendientes', porcentaje: 14 },
      { estado: 'Canceladas', porcentaje: 0 }
    ];

    estadoReservasLeyenda: Array<{ nombre: string, color: string, cantidad: number }> = [
      { nombre: 'Completadas', color: '#17c964', cantidad: 186 },
      { nombre: 'Reservadas', color: '#0070f3', cantidad: 27 },
      { nombre: 'Pendientes', color: '#f5a524', cantidad: 35 },
      { nombre: 'Canceladas', color: '#f31260', cantidad: 0 }
    ];
  // Referencia al modal de creación de usuario
  @ViewChild(CreateUserModal) createUserModal!: CreateUserModal;

  // Información del administrador
  adminName: string = 'Administrador';
  adminEmail: string = 'admin@uis.edu.co';
  adminInitials: string = 'AD';

  // Control de navegación
  activeSection: string = 'inicio';
  currentPageTitle: string = 'Panel de Administración';
  isSidebarOpen: boolean = false;

  // Estadísticas
  userStats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    newUsersThisMonth: 0
  };

  reservationStats: ReservationStats = {
    totalReservations: 0,
    activeReservations: 0,
    completedReservations: 0,
    cancelledReservations: 0
  };

  roomStats: RoomStats = {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0
  };

  recentActivities: RecentActivity[] = [];

  // Gestión de usuarios
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loadingUsers: boolean = false;
  searchTerm: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';

  // Roles disponibles
  roles: Rol[] = [];
  loadingRoles: boolean = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario es administrador
    if (!this.authService.isAdmin()) {
      console.warn('Acceso denegado: el usuario no es administrador');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Inicializar componente
    this.updatePageTitle();
    
    // Obtener información del administrador
    const userData = this.authService.getUserData();
    if (userData && userData.codigo) {
      this.adminName = userData.codigo;
      this.adminEmail = `${userData.codigo}@uis.edu.co`;
      this.adminInitials = this.getUserInitials(this.adminName);
      
      // Intentar obtener el perfil completo
      const profile = this.authService.getCachedProfile();
      if (profile) {
        if (profile.nombre || profile.apellido) {
          this.adminName = `${profile.nombre || ''} ${profile.apellido || ''}`.trim();
          this.adminEmail = profile.correo || this.adminEmail;
          this.adminInitials = this.getUserInitials(this.adminName);
        }
      }
    }

    // Cargar estadísticas (datos de ejemplo, deberían venir del backend)
    this.loadStatistics();
    this.loadRecentActivities();
    
    // Cargar roles y usuarios automáticamente al iniciar
    this.loadRoles();
    this.loadUsers();
  }

  /**
   * Carga las estadísticas del sistema
   */
  loadStatistics(): void {
    // Datos de ejemplo - En producción, estos vendrían del backend
    this.userStats = {
      totalUsers: 1247,
      activeUsers: 1098,
      blockedUsers: 15,
      newUsersThisMonth: 87
    };

    this.reservationStats = {
      totalReservations: 3456,
      activeReservations: 234,
      completedReservations: 3102,
      cancelledReservations: 120
    };

    this.roomStats = {
      totalRooms: 45,
      availableRooms: 23,
      occupiedRooms: 18,
      maintenanceRooms: 4
    };
  }

  /**
   * Carga las actividades recientes
   */
  loadRecentActivities(): void {
    // Datos de ejemplo - En producción, estos vendrían del backend
    this.recentActivities = [
      {
        id: 1,
        type: 'user',
        description: 'Nuevo usuario registrado: Juan Pérez',
        timestamp: 'Hace 5 minutos',
        icon: 'bi-person-plus'
      },
      {
        id: 2,
        type: 'reservation',
        description: 'Nueva reserva creada para Sala B-302',
        timestamp: 'Hace 15 minutos',
        icon: 'bi-calendar-check'
      },
      {
        id: 3,
        type: 'room',
        description: 'Sala A-105 marcada en mantenimiento',
        timestamp: 'Hace 1 hora',
        icon: 'bi-tools'
      },
      {
        id: 4,
        type: 'report',
        description: 'Nuevo reporte generado',
        timestamp: 'Hace 2 horas',
        icon: 'bi-file-earmark-text'
      },
      {
        id: 5,
        type: 'user',
        description: 'Usuario desbloqueado: María García',
        timestamp: 'Hace 3 horas',
        icon: 'bi-unlock'
      }
    ];
  }

  /**
   * Cambia la sección activa del dashboard
   */
  setActiveSection(section: string): void {
    this.activeSection = section;
    this.updatePageTitle();
    
    // Ya no es necesario cargar aquí porque se carga al iniciar
    // if (section === 'usuarios' && this.usuarios.length === 0) {
    //   this.loadUsers();
    // }
    
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth < 992) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Actualiza el título de la página según la sección activa
   */
  updatePageTitle(): void {
    const titles: { [key: string]: string } = {
      'inicio': 'Panel de Administración',
      'usuarios': 'Gestión de Usuarios',
      'reservas': 'Gestión de Reservas',
      'espacios': 'Gestión de Espacios',
      'reportes': 'Reportes y Estadísticas',
      'configuracion': 'Configuración del Sistema'
    };
    this.currentPageTitle = titles[this.activeSection] || 'Panel de Administración';
  }

  /**
   * Obtiene las iniciales del nombre del usuario
   */
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * Alterna la visibilidad del sidebar en móvil
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Cierra sesión del administrador
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Obtiene la clase de color según el tipo de actividad
   */
  getActivityColorClass(type: string): string {
    const colorMap: { [key: string]: string } = {
      'user': 'text-primary',
      'reservation': 'text-success',
      'room': 'text-warning',
      'report': 'text-info'
    };
    return colorMap[type] || 'text-secondary';
  }

  /**
   * GESTIÓN DE USUARIOS
   */

  /**
   * Carga la lista de roles desde el backend
   */
  loadRoles(): void {
    this.loadingRoles = true;
    this.adminService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
        console.log('Roles cargados:', roles);
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
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
   * Carga la lista de usuarios desde el backend
   */
  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.loadingUsers = false;
        console.log('Usuarios cargados:', usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loadingUsers = false;
        // Mostrar mensaje de error al usuario
        alert('Error al cargar la lista de usuarios. Por favor, intente nuevamente.');
      }
    });
  }

  /**
   * Filtra usuarios según los criterios de búsqueda
   */
  filterUsers(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      // Filtro de búsqueda por texto
      const searchMatch = !this.searchTerm || 
        usuario.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.apellido?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.codigo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        usuario.correo?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por rol - ahora soporta filtrado dinámico por ID de rol
      const roleMatch = this.filterRole === 'all' || 
        usuario.id_rol === parseInt(this.filterRole);

      // Filtro por estado
      const statusMatch = this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && usuario.activo && !usuario.bloqueado) ||
        (this.filterStatus === 'inactive' && !usuario.activo) ||
        (this.filterStatus === 'blocked' && usuario.bloqueado);

      return searchMatch && roleMatch && statusMatch;
    });
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getUserAvatarInitials(usuario: Usuario): string {
    if (!usuario.nombre && !usuario.apellido) {
      return usuario.codigo.substring(0, 2).toUpperCase();
    }
    const nombre = usuario.nombre?.charAt(0) || '';
    const apellido = usuario.apellido?.charAt(0) || '';
    return (nombre + apellido).toUpperCase();
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getUserFullName(usuario: Usuario): string {
    if (usuario.nombre || usuario.apellido) {
      return `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
    }
    return usuario.codigo;
  }

  /**
   * Obtiene el nombre del rol
   */
  getRoleName(idRol: number): string {
    // Si los roles aún no se han cargado, mostrar el ID temporalmente
    if (!this.roles || this.roles.length === 0) {
      // Mapeo de respaldo mientras se cargan los roles
      const rolesMap: { [key: number]: string } = {
        1: 'Administrador',
        2: 'Tutor',
        3: 'Estudiante'
      };
      return rolesMap[idRol] || 'Usuario';
    }
    
    const rol = this.roles.find(r => r.idRol === idRol);
    return rol ? rol.nombre : 'Usuario';
  }

  /**
   * Obtiene la clase CSS del badge de rol
   */
  getRoleBadgeClass(idRol: number): string {
    // Administrador
    if (idRol === 1) return 'admin';
    // Tutor
    if (idRol === 2) return 'tutor';
    // Estudiante
    if (idRol === 3) return 'student';
    return 'other';
  }

  /**
   * Obtiene el estado del usuario
   */
  getUserStatus(usuario: Usuario): { text: string, class: string } {
    if (usuario.bloqueado) {
      return { text: 'Bloqueado', class: 'blocked' };
    }
    if (usuario.activo) {
      return { text: 'Activo', class: 'active' };
    }
    return { text: 'Inactivo', class: 'inactive' };
  }

  /**
   * Edita un usuario
   */
  editUser(usuario: Usuario): void {
    console.log('Editar usuario:', usuario);
    // Aquí implementarás la lógica para abrir un modal o navegar a un formulario
    alert(`Funcionalidad de edición para ${this.getUserFullName(usuario)} - En desarrollo`);
  }

  /**
   * Bloquea/Desbloquea un usuario
   */
  toggleBlockUser(usuario: Usuario): void {
    const action = usuario.bloqueado ? 'desbloquear' : 'bloquear';
    if (confirm(`¿Está seguro de que desea ${action} a ${this.getUserFullName(usuario)}?`)) {
      this.loadingUsers = true; // Mostrar indicador de carga
      
      const observable = usuario.bloqueado 
        ? this.adminService.unblockUser(usuario.id_usuario)
        : this.adminService.blockUser(usuario.id_usuario);

      observable.subscribe({
        next: (updatedUser) => {
          // Actualizar el usuario en la lista
          const index = this.usuarios.findIndex(u => u.id_usuario === usuario.id_usuario);
          if (index !== -1) {
            this.usuarios[index] = updatedUser;
            this.filterUsers();
          }
          this.loadingUsers = false;
          console.log(`Usuario ${action}ado exitosamente:`, updatedUser);
          alert(`Usuario ${action}ado exitosamente`);
        },
        error: (error) => {
          console.error(`Error al ${action} usuario:`, error);
          this.loadingUsers = false;
          
          let errorMessage = `Error al ${action} usuario. `;
          if (error.status === 0) {
            errorMessage += 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
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

  /**
   * Elimina un usuario
   */
  deleteUser(usuario: Usuario): void {
    if (confirm(`¿Está seguro de que desea eliminar a ${this.getUserFullName(usuario)}? Esta acción no se puede deshacer.`)) {
      this.loadingUsers = true;
      
      this.adminService.deleteUser(usuario.id_usuario).subscribe({
        next: () => {
          // Remover el usuario de la lista
          this.usuarios = this.usuarios.filter(u => u.id_usuario !== usuario.id_usuario);
          this.filterUsers();
          this.loadingUsers = false;
          alert('Usuario eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.loadingUsers = false;
          
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

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateUserModal(): void {
    this.createUserModal.open();
  }

  /**
   * Maneja el evento de usuario creado exitosamente
   */
  onUserCreated(newUser: Usuario): void {
    console.log('Usuario creado:', newUser);
    // Recargar la lista de usuarios para mostrar el nuevo usuario
    this.loadUsers();
  }
}

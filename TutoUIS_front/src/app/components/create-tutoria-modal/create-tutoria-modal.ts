import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService, Carrera, TutorInfo, CreateTutoriaDto } from '../../services/tutoria.service';
import { AdminService, Usuario } from '../../services/admin.service';

@Component({
  selector: 'app-create-tutoria-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-tutoria-modal.html',
  styleUrl: './create-tutoria-modal.css'
})
export class CreateTutoriaModal implements OnInit {
  @ViewChild('createTutoriaModal') modal!: ElementRef;
  @Output() tutoriaCreated = new EventEmitter<any>();

  // Referencia del modal de Bootstrap
  private bootstrapModal: any;

  // Datos del formulario
  form = {
    idTutor: '',
    idCarrera: '',
    nombre: '',
    descripcion: '',
    capacidadMaxima: 30,
    ubicacion: ''
  };

  // Listas para los dropdowns
  tutores: TutorInfo[] = [];
  carreras: Carrera[] = [];

  // Estados del modal
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Contador de peticiones pendientes
  private pendingRequests: number = 0;

  constructor(
    private tutoriaService: TutoriaService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    console.log('🚀 Inicializando CreateTutoriaModal...');
    // No cargar datos en el init, solo cuando se abra el modal
  }

  ngAfterViewInit(): void {
    // Inicializar el modal de Bootstrap
    const modalElement = this.modal?.nativeElement;
    if (modalElement) {
      this.bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      
      // Limpiar el formulario cuando se cierre el modal
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  }

  /**
   * Carga la lista de tutores disponibles
   */
  loadTutores(): void {
    console.log('🔍 Cargando tutores...');
    
    this.tutoriaService.getTutores().subscribe({
      next: (data) => {
        console.log('📥 Datos recibidos del backend (tutores):', data);
        console.log('📊 Cantidad de registros:', data.length);
        
        if (data && data.length > 0) {
          console.log('📋 Estructura del primer registro:', data[0]);
          
          // Normalizar los datos para que funcionen con ambas nomenclaturas
          this.tutores = data.map((user: any) => ({
            ...user,
            idUsuario: user.id_usuario || user.idUsuario,
            idRol: user.id_rol || user.idRol
          }));
          
          // Filtrar solo los tutores (rol id = 2)
          this.tutores = this.tutores.filter((user: any) => {
            const rolId = user.idRol || user.id_rol;
            console.log(`👤 Usuario ${user.nombre} ${user.apellido}: rol_id = ${rolId}`);
            return rolId === 2;
          });
          
          console.log('✅ Tutores filtrados (rol_id=2):', this.tutores.length);
          
          if (this.tutores.length === 0) {
            console.warn('⚠️ No hay tutores disponibles');
            if (!this.errorMessage) {
              this.errorMessage = '⚠️ No hay tutores disponibles. No se encontraron usuarios con rol de tutor (rol_id = 2).';
            }
          } else {
            console.log('👥 Lista de tutores:', this.tutores);
          }
        } else {
          console.warn('⚠️ No se recibieron datos del backend');
          if (!this.errorMessage) {
            this.errorMessage = '⚠️ No se encontraron usuarios en el sistema.';
          }
        }
        
        this.markRequestComplete();
      },
      error: (error) => {
        console.error('❌ Error cargando tutores:', error);
        console.error('❌ Detalles del error:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          this.errorMessage = '❌ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080';
        } else if (error.status === 404) {
          this.errorMessage = '❌ Endpoint de usuarios no encontrado. Verifica la URL del API.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = '❌ No tienes permisos para cargar la lista de tutores.';
        } else {
          this.errorMessage = `❌ Error al cargar tutores: ${error.message || 'Error desconocido'}`;
        }
        
        this.markRequestComplete();
      }
    });
  }

  /**
   * Carga la lista de carreras disponibles
   */
  loadCarreras(): void {
    console.log('🔍 Cargando carreras...');
    
    this.tutoriaService.getAllCarreras().subscribe({
      next: (data) => {
        console.log('📥 Carreras recibidas del backend:', data);
        console.log('📊 Cantidad de carreras:', data.length);
        
        // Normalizar los datos para que funcionen con ambas nomenclaturas
        this.carreras = data.map((carrera: any) => ({
          ...carrera,
          idCarrera: carrera.id_carrera || carrera.idCarrera
        }));
        
        if (this.carreras.length === 0) {
          console.warn('⚠️ No hay carreras registradas');
          if (!this.errorMessage) {
            this.errorMessage = '⚠️ No hay carreras disponibles en el sistema. Por favor, registra al menos una carrera.';
          }
        } else {
          console.log('✅ Carreras cargadas correctamente:', this.carreras);
        }
        
        this.markRequestComplete();
      },
      error: (error) => {
        console.error('❌ Error cargando carreras:', error);
        console.error('❌ Detalles del error:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          this.errorMessage = '❌ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080';
        } else if (error.status === 404) {
          this.errorMessage = '❌ Endpoint de carreras no encontrado. Verifica la URL del API.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = '❌ No tienes permisos para cargar la lista de carreras.';
        } else {
          this.errorMessage = `❌ Error al cargar carreras: ${error.message || 'Error desconocido'}`;
        }
        
        this.markRequestComplete();
      }
    });
  }

  /**
   * Abre el modal
   */
  open(): void {
    this.resetForm();
    
    // Solo recargar si no hay datos o si queremos forzar la recarga
    if (this.tutores.length === 0 || this.carreras.length === 0) {
      this.recargarDatos();
    }
    
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
    }
  }

  /**
   * Recarga los datos de tutores y carreras
   */
  recargarDatos(): void {
    console.log('🔄 Recargando datos de tutores y carreras...');
    this.loading = true;
    this.pendingRequests = 2; // Dos peticiones: tutores y carreras
    this.errorMessage = '';
    
    this.loadTutores();
    this.loadCarreras();
  }
  
  /**
   * Marca una petición como completada y actualiza el estado de loading
   */
  private markRequestComplete(): void {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
      console.log('✅ Todas las peticiones completadas');
    }
  }

  /**
   * Cierra el modal
   */
  close(): void {
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
  }

  /**
   * Envía el formulario para crear una nueva tutoría
   */
  submitForm(): void {
    // Validaciones
    if (!this.form.idTutor) {
      this.errorMessage = 'Por favor selecciona un tutor';
      return;
    }
    if (!this.form.idCarrera) {
      this.errorMessage = 'Por favor selecciona una carrera';
      return;
    }
    if (!this.form.nombre.trim()) {
      this.errorMessage = 'Por favor ingresa un nombre para la tutoría';
      return;
    }
    if (this.form.capacidadMaxima < 1) {
      this.errorMessage = 'La capacidad máxima debe ser mayor a 0';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const tutoriaDto: CreateTutoriaDto = {
      idTutor: parseInt(this.form.idTutor),
      idCarrera: parseInt(this.form.idCarrera),
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim() || undefined,
      capacidadMaxima: this.form.capacidadMaxima,
      ubicacion: this.form.ubicacion.trim() || undefined
    };

    this.tutoriaService.createTutoria(tutoriaDto).subscribe({
      next: (tutoria) => {
        this.successMessage = '✓ Tutoría creada exitosamente';
        this.submitting = false;
        
        // Emitir evento para que el componente padre actualice la lista
        this.tutoriaCreated.emit(tutoria);
        
        // Cerrar el modal después de 1 segundo
        setTimeout(() => {
          this.close();
          this.successMessage = '';
        }, 1000);
      },
      error: (error) => {
        console.error('Error creando tutoría:', error);
        this.errorMessage = error?.error?.mensaje || 'Error al crear la tutoría';
        this.submitting = false;
      }
    });
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    this.form = {
      idTutor: '',
      idCarrera: '',
      nombre: '',
      descripcion: '',
      capacidadMaxima: 30,
      ubicacion: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Obtiene el nombre del tutor por ID
   */
  getNombreTutor(idTutor: string): string {
    const tutor = this.tutores.find(t => {
      const id = t.idUsuario || t.id_usuario;
      return id && id.toString() === idTutor;
    });
    return tutor ? `${tutor.nombre} ${tutor.apellido}` : '';
  }

  /**
   * Obtiene el nombre de la carrera por ID
   */
  getNombreCarrera(idCarrera: string): string {
    const carrera = this.carreras.find(c => {
      const id = c.idCarrera || (c as any).id_carrera;
      return id && id.toString() === idCarrera;
    });
    return carrera ? carrera.nombre : '';
  }

  /**
   * Obtiene el tooltip del botón Crear según el estado
   */
  getBotonCrearTooltip(): string {
    if (this.loading) {
      return 'Cargando datos...';
    }
    if (this.tutores.length === 0 && this.carreras.length === 0) {
      return 'No hay tutores ni carreras disponibles';
    }
    if (this.tutores.length === 0) {
      return 'No hay tutores disponibles';
    }
    if (this.carreras.length === 0) {
      return 'No hay carreras disponibles';
    }
    if (this.submitting) {
      return 'Creando tutoría...';
    }
    return 'Crear nueva tutoría';
  }
}

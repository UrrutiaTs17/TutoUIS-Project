import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService, Carrera, TutorInfo, CreateTutoriaDto } from '../../services/tutoria.service';
import { AdminService, Usuario } from '../../services/admin.service';
import { AsignaturaService, Asignatura } from '../../services/asignatura.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';

// Interfaz para Disponibilidad
interface Disponibilidad {
  diaSemana: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

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
    idAsignatura: '',
    nombre: '',
    descripcion: '',
    ubicacion: ''
  };

  // Disponibilidades de la tutoría
  disponibilidades: Disponibilidad[] = [];

  // Modo de edición
  isEditMode: boolean = false;
  tutoriaIdEditar: number | null = null;

  // Listas para los dropdowns
  tutores: TutorInfo[] = [];
  carreras: Carrera[] = [];
  asignaturas: Asignatura[] = [];
  asignaturasFiltradas: Asignatura[] = [];
  carreraSeleccionadaNombre: string = '';

  // Estados del modal
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  datosIntentadosCargar: boolean = false; // Para saber si ya se intentó cargar datos
  
  // Contador de peticiones pendientes
  private pendingRequests: number = 0;

  constructor(
    private tutoriaService: TutoriaService,
    private adminService: AdminService,
    private asignaturaService: AsignaturaService,
    private disponibilidadService: DisponibilidadService,
    private cdr: ChangeDetectorRef
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
          console.log('🔑 Claves disponibles:', Object.keys(data[0]));
          
          // Filtrar solo los tutores (rol id = 2) - usar id_rol directamente del backend
          this.tutores = data.filter((user: any) => {
            const rolId = user.id_rol;
            console.log(`👤 Usuario ${user.nombre} ${user.apellido}: id_rol=${rolId}, id_usuario=${user.id_usuario}, id_carrera=${user.id_carrera}`);
            return rolId === 2;
          });
          
          console.log('✅ Tutores filtrados (id_rol=2):', this.tutores.length);
          
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
   * Abre el modal en modo creación
   */
  open(): void {
    this.isEditMode = false;
    this.tutoriaIdEditar = null;
    this.resetForm();
    
    // Mostrar el modal inmediatamente
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
    }
    
    // Cargar datos en segundo plano sin mostrar loading
    setTimeout(() => {
      // Solo recargar si no hay datos
      if (this.tutores.length === 0 || this.carreras.length === 0 || this.asignaturas.length === 0) {
        this.recargarDatosSilencioso();
      }
    }, 0);
  }

  /**
   * Abre el modal en modo edición
   */
  openForEdit(tutoria: any): void {
    console.log('📝 Abriendo modal en modo EDICIÓN para tutoría:', tutoria);
    this.isEditMode = true;
    this.tutoriaIdEditar = tutoria.idTutoria;
    
    // Cargar datos si no están cargados
    if (this.tutores.length === 0 || this.carreras.length === 0) {
      this.recargarDatos();
    }
    
    // Llenar el formulario con los datos de la tutoría
    setTimeout(() => {
      this.form = {
        idTutor: tutoria.idTutor?.toString() || '',
        idCarrera: tutoria.idCarrera?.toString() || '',
        idAsignatura: tutoria.idAsignatura?.toString() || '',
        nombre: tutoria.nombre || tutoria.nombreAsignatura || '',
        descripcion: tutoria.descripcion || '',
        ubicacion: tutoria.ubicacion || tutoria.lugar || ''
      };
      
      // Si hay carrera, actualizar asignaturas filtradas
      if (this.form.idCarrera) {
        this.actualizarAsignaturasFiltradas();
      }
      
      // Cargar disponibilidades existentes
      console.log('🔍 Cargando disponibilidades existentes para tutoría:', tutoria.idTutoria);
      this.disponibilidadService.getDisponibilidadesByTutoria(tutoria.idTutoria).subscribe({
        next: (disponibilidades: any) => {
          console.log('✅ Disponibilidades cargadas:', disponibilidades);
          this.disponibilidades = disponibilidades.map((disp: any) => ({
            diaSemana: disp.diaSemana,
            fecha: disp.fecha,
            horaInicio: disp.horaInicio.substring(0, 5), // HH:mm
            horaFin: disp.horaFin.substring(0, 5) // HH:mm
          }));
          console.log('📋 Disponibilidades mapeadas:', this.disponibilidades);
        },
        error: (error: any) => {
          console.error('❌ Error cargando disponibilidades:', error);
          this.disponibilidades = [];
        }
      });
    }, 500);
    
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
    }
  }

  /**
   * Recarga los datos de tutores y carreras (con loading visible)
   */
  recargarDatos(): void {
    console.log('🔄 Recargando datos de tutores y carreras...');
    this.loading = true;
    this.pendingRequests = 3; // Tutores, carreras, asignaturas
    this.errorMessage = '';
    this.successMessage = '';
    this.datosIntentadosCargar = true;
    
    // Iniciar las cargas
    this.loadTutores();
    this.loadCarreras();
    this.loadAsignaturas();
  }

  /**
   * Recarga los datos sin mostrar el spinner de carga
   */
  recargarDatosSilencioso(): void {
    console.log('🔄 Cargando datos en segundo plano...');
    this.pendingRequests = 3; // Tutores, carreras, asignaturas
    this.errorMessage = '';
    this.successMessage = '';
    this.datosIntentadosCargar = true;
    
    // Iniciar las cargas sin activar loading
    this.loadTutores();
    this.loadCarreras();
    this.loadAsignaturas();
  }
  
  /**
   * Marca una petición como completada y actualiza el estado de loading
   */
  private markRequestComplete(): void {
    this.pendingRequests--;
    console.log(`📊 Peticiones pendientes: ${this.pendingRequests}`);
    
    if (this.pendingRequests <= 0) {
      setTimeout(() => {
        this.loading = false;
        console.log('✅ Todas las peticiones completadas - loading = false');
      }, 100);
    }
  }

  /**
   * Carga todas las asignaturas disponibles
   */
  loadAsignaturas(): void {
    console.log('🔍 Cargando asignaturas...');
    this.asignaturaService.getAllAsignaturas().subscribe({
      next: (data) => {
        // Normalizar id
        this.asignaturas = data.map(a => ({
          ...a,
          idAsignatura: a.idAsignatura || (a as any).id_asignatura
        }));
        console.log('✅ Asignaturas cargadas:', this.asignaturas.length);
        this.actualizarAsignaturasFiltradas();
        this.markRequestComplete();
      },
      error: (err) => {
        console.error('❌ Error cargando asignaturas', err);
        if (!this.errorMessage) {
          this.errorMessage = 'Error al cargar asignaturas';
        }
        this.markRequestComplete();
      }
    });
  }

  /**
   * Cuando cambia el tutor seleccionado: fija carrera y filtra asignaturas
   */
  onTutorChange(): void {
    console.log('🔄 onTutorChange - ID Tutor seleccionado:', this.form.idTutor);
    
    if (!this.form.idTutor) {
      this.form.idCarrera = '';
      this.carreraSeleccionadaNombre = '';
      this.asignaturasFiltradas = [];
      return;
    }
    
    // Buscar tutor por id_usuario
    const tutor = this.tutores.find(t => t.id_usuario?.toString() === this.form.idTutor);
    console.log('👤 Tutor encontrado:', tutor);
    
    if (!tutor) {
      console.warn('⚠️ No se encontró el tutor con id:', this.form.idTutor);
      return;
    }
    
    const idCarreraTutor = tutor.id_carrera;
    console.log('🎓 ID Carrera del tutor:', idCarreraTutor);
    
    if (idCarreraTutor) {
      this.form.idCarrera = idCarreraTutor.toString();
      
      // Buscar nombre de la carrera
      const carrera = this.carreras.find(c => {
        const id = (c as any).id_carrera || c.idCarrera;
        return id?.toString() === this.form.idCarrera;
      });
      
      this.carreraSeleccionadaNombre = carrera ? carrera.nombre : '';
      console.log('✅ Carrera asignada:', this.carreraSeleccionadaNombre);
    } else {
      this.form.idCarrera = '';
      this.carreraSeleccionadaNombre = '';
      console.warn('⚠️ El tutor no tiene carrera asignada');
    }
    
    this.actualizarAsignaturasFiltradas();
  }

  /**
   * Filtra asignaturas asociadas a la carrera (placeholder: sin relación explícita se muestran todas)
   */
  actualizarAsignaturasFiltradas(): void {
    // Sin relación carrera-asignatura en modelo: retorno todas.
    // Si se añade relación futura, ajustar aquí.
    this.asignaturasFiltradas = [...this.asignaturas];
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
   * Envía el formulario para crear o actualizar una tutoría
   */
  submitForm(): void {
    console.log('📝 submitForm - Iniciando validación y envío');
    console.log('📋 Datos del formulario:', this.form);
    console.log('� Disponibilidades:', this.disponibilidades);
    console.log('�🔧 Modo:', this.isEditMode ? 'EDICIÓN' : 'CREACIÓN');
    
    // Validaciones básicas
    if (!this.form.idTutor) {
      this.errorMessage = 'Por favor selecciona un tutor';
      return;
    }
    if (!this.form.idCarrera) {
      this.errorMessage = 'La carrera asociada al tutor no se pudo determinar';
      return;
    }
    if (!this.form.idAsignatura) {
      this.errorMessage = 'Por favor selecciona una asignatura';
      return;
    }

    // Validar disponibilidades
    if (this.disponibilidades.length === 0) {
      this.errorMessage = 'Por favor agrega al menos una disponibilidad horaria';
      return;
    }

    // Validar que todas las disponibilidades estén completas
    for (let i = 0; i < this.disponibilidades.length; i++) {
      const disp = this.disponibilidades[i];
      if (!disp.diaSemana || !disp.fecha || !disp.horaInicio || !disp.horaFin) {
        this.errorMessage = `La disponibilidad ${i + 1} tiene campos incompletos`;
        return;
      }
      // Validar que hora fin sea mayor que hora inicio
      if (disp.horaInicio >= disp.horaFin) {
        this.errorMessage = `La disponibilidad ${i + 1}: la hora de fin debe ser mayor que la hora de inicio`;
        return;
      }
    }

    console.log('✅ Validaciones pasadas');
    this.submitting = true;
    this.errorMessage = '';

    const tutoriaDto: any = {
      idTutor: parseInt(this.form.idTutor),
      idCarrera: parseInt(this.form.idCarrera),
      idAsignatura: parseInt(this.form.idAsignatura),
      descripcion: this.form.descripcion.trim() || undefined,
      ubicacion: this.form.ubicacion.trim() || undefined,
      disponibilidades: this.disponibilidades.map(disp => ({
        diaSemana: disp.diaSemana,
        fecha: disp.fecha,
        horaInicio: disp.horaInicio + ':00', // Agregar segundos
        horaFin: disp.horaFin + ':00', // Agregar segundos
        aforoMaximo: 8 // Aforo fijo de 8 personas por slot de 15 minutos
      }))
    };

    console.log('📦 DTO creado con disponibilidades:', tutoriaDto);

    if (this.isEditMode && this.tutoriaIdEditar) {
      // MODO EDICIÓN
      console.log('🚀 Llamando a tutoriaService.updateTutoria...');
      this.tutoriaService.updateTutoria(this.tutoriaIdEditar, tutoriaDto).subscribe({
        next: (tutoria) => {
          console.log('✅ Tutoría actualizada exitosamente:', tutoria);
          this.successMessage = '✓ Tutoría actualizada exitosamente';
          this.submitting = false;
          
          // Emitir evento para que el componente padre actualice la lista
          this.tutoriaCreated.emit(tutoria);
          
          // Mostrar alert y cerrar modal
          setTimeout(() => {
            alert('✓ Tutoría actualizada exitosamente');
            this.close();
            this.successMessage = '';
          }, 100);
        },
        error: (error) => {
          console.error('❌ Error actualizando tutoría:', error);
          this.errorMessage = error?.error?.mensaje || 'Error al actualizar la tutoría';
          this.submitting = false;
        }
      });
    } else {
      // MODO CREACIÓN (con disponibilidades)
      console.log('🚀 Llamando a tutoriaService.createTutoriaConDisponibilidades...');
      this.tutoriaService.createTutoriaConDisponibilidades(tutoriaDto).subscribe({
        next: (tutoria) => {
          console.log('✅ Tutoría con disponibilidades creada exitosamente:', tutoria);
          this.successMessage = '✓ Tutoría creada exitosamente con sus disponibilidades';
          this.submitting = false;
          
          // Emitir evento para que el componente padre actualice la lista
          this.tutoriaCreated.emit(tutoria);
          
          // Mostrar alert y cerrar modal
          setTimeout(() => {
            alert('✓ Tutoría creada exitosamente con sus disponibilidades');
            this.close();
            this.successMessage = '';
          }, 100);
        },
        error: (error) => {
          console.error('❌ Error creando tutoría con disponibilidades:', error);
        console.error('❌ Detalles completos:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        // Mensaje de error mejorado
        let errorMsg = 'Error al crear la tutoría';
        if (error.status === 0) {
          errorMsg = '❌ No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
        } else if (error.status === 400) {
          errorMsg = error.error?.mensaje || error.error?.message || 'Datos inválidos. Verifica los campos.';
        } else if (error.status === 401 || error.status === 403) {
          errorMsg = '❌ No tienes permisos para crear tutorías.';
        } else if (error.error?.mensaje) {
          errorMsg = error.error.mensaje;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        }
        
          this.errorMessage = errorMsg;
          this.submitting = false;
        }
      });
    }
  }

  /**
   * Resetea el formulario
   */
  /**
   * Agregar una nueva disponibilidad
   */
  agregarDisponibilidad(): void {
    const nuevaDisponibilidad: Disponibilidad = {
      diaSemana: '',
      fecha: '',
      horaInicio: '',
      horaFin: ''
    };
    this.disponibilidades.push(nuevaDisponibilidad);
  }

  /**
   * Eliminar una disponibilidad por índice
   */
  eliminarDisponibilidad(index: number): void {
    this.disponibilidades.splice(index, 1);
  }

  resetForm(): void {
    this.form = {
      idTutor: '',
      idCarrera: '',
      idAsignatura: '',
      nombre: '',
      descripcion: '',
      ubicacion: ''
    };
    this.disponibilidades = [];
    this.isEditMode = false;
    this.tutoriaIdEditar = null;
    this.carreraSeleccionadaNombre = '';
    this.asignaturasFiltradas = [];
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

  /**
   * Actualiza automáticamente el día de la semana cuando se selecciona una fecha
   */
  onFechaChange(index: number, fecha: string): void {
    if (!fecha) {
      this.disponibilidades[index].diaSemana = '';
      return;
    }

    try {
      const fechaObj = new Date(fecha + 'T00:00:00');
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const diaSemana = diasSemana[fechaObj.getDay()];
      
      this.disponibilidades[index].diaSemana = diaSemana;
      this.cdr.detectChanges();
      
      console.log(`📅 Fecha cambiada: ${fecha} -> ${diaSemana}`);
    } catch (error) {
      console.error('Error al procesar fecha:', error);
      this.disponibilidades[index].diaSemana = '';
    }
  }

  /**
   * Detecta si un mensaje de error es de conflicto de horario
   */
  isConflictError(errorMsg: string): boolean {
    return errorMsg?.toLowerCase().includes('conflicto') || 
           errorMsg?.toLowerCase().includes('horario') ||
           errorMsg?.toLowerCase().includes('ya existe');
  }

  /**
   * Formatea el mensaje de error para mostrarlo de manera amigable
   */
  formatErrorMessage(errorMsg: string): string {
    if (!errorMsg) return 'Error desconocido';
    
    // Si es un error de conflicto, extraer solo el mensaje relevante
    if (this.isConflictError(errorMsg)) {
      // Buscar el patrón "Ya existe una tutoría..."
      const match = errorMsg.match(/Ya existe una tutoría[^.]*\./i);
      if (match) {
        return match[0];
      }
    }
    
    return errorMsg;
  }
}

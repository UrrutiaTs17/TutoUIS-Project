import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';

type MateriaCatalogo = {
  id: number;
  nombre: string;
  docente: string;
  cupos: string;
  area?: 'math' | 'phys' | 'prog';
};

type MateriaCelda = {
  nombre: string;
  detalle: string;   // ej: "Arrays • Carlos Ruiz"
  cupos: string;     // ej: "4/6"
  clase?: string;    // ej: "dept-prog" para pintar borde
  tooltip?: string;  // ej: "Laboratorio 3 • 12 semanas"
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {

  /** Cuando es false, ocultamos el buscador y mostramos directamente el calendario */
  @Input() showSearch: boolean = true;

  // ======== Cabeceras de tabla ========
  dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas = ['6:00 - 8:00', '8:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00'];

  // ======== Buscador (demo) ========
  searchControl = new FormControl<string>('', { nonNullable: true });
  suggestions$!: Observable<MateriaCatalogo[]>;
  showDropdown = false;
  activeIndex = 0;

  // Catálogo de materias (demo). En producción: substituir por servicio HTTP.
  private materias: MateriaCatalogo[] = [
    { id: 1, nombre: 'Cálculo I',       docente: 'Juan Pérez',    cupos: '3/5', area: 'math' },
    { id: 2, nombre: 'Programación I',  docente: 'Carlos Ruiz',   cupos: '4/6', area: 'prog' },
    { id: 3, nombre: 'Física I',        docente: 'María González',cupos: '2/4', area: 'phys' },
    { id: 4, nombre: 'Álgebra Lineal',  docente: 'Ana Torres',    cupos: '3/5', area: 'math' },
  ];

  // ======== Pintado del horario ========
  // clave: `${hora}__${dia}`
  private schedule = new Map<string, MateriaCelda>([
    ['8:00 - 10:00__Lunes', {
      nombre: 'Cálculo I',
      detalle: 'Límites • Juan Pérez',
      cupos: '3/5',
      clase: 'dept-math',
      tooltip: 'Aula 201 • 16 semanas'
    }],
    ['10:00 - 12:00__Miércoles', {
      nombre: 'Programación I',
      detalle: 'Arrays • Carlos Ruiz',
      cupos: '4/6',
      clase: 'dept-prog',
      tooltip: 'Laboratorio 3 • 12 semanas'
    }],
    ['14:00 - 16:00__Martes', {
      nombre: 'Física I',
      detalle: 'Cinemática • María González',
      cupos: '2/4',
      clase: 'dept-phys'
    }],
    ['16:00 - 18:00__Jueves', {
      nombre: 'Álgebra Lineal',
      detalle: 'Matrices • Ana Torres',
      cupos: '3/5',
      clase: 'dept-math'
    }],
  ]);

  // selección de celda (para resaltar/acciones)
  selected: { hora: string; dia: string } | null = null;

  constructor(private modalService: ModalService) {}

  // ======== Ciclo de vida ========
  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounceTime(200),
      distinctUntilChanged(),
      map(q => this.filterCatalogo(q || ''))
    );

    // mostrar/ocultar dropdown
    this.suggestions$.subscribe(list => {
      const hasQuery = !!this.searchControl.value?.trim();
      this.showDropdown = hasQuery || list.length > 0;
      this.activeIndex = 0;
    });
  }

  // ======== Helpers de tabla ========
  trackHora = (_: number, h: string) => h;
  trackDia  = (_: number, d: string) => d;

  // ✅ trackBy para la lista de sugerencias (Materias del catálogo)
trackMateria = (_: number, m: MateriaCatalogo) => m.id; // o `${m.id}-${m.nombre}`

  private key(hora: string, dia: string) { return `${hora}__${dia}`; }

  getMateria(hora: string, dia: string): MateriaCelda | undefined {
    return this.schedule.get(this.key(hora, dia));
  }

  // Nueva función: solo muestra la materia buscada
  getMateriaFiltrada(hora: string, dia: string): MateriaCelda | undefined {
    const materia = this.getMateria(hora, dia);
    const query = this.searchControl.value?.toLowerCase().trim();
    if (!materia || !query) return undefined;
    // Coincidencia por nombre de materia
    return materia.nombre.toLowerCase().includes(query) ? materia : undefined;
  }

  selectCell(hora: string, dia: string) {
    this.selected = { hora, dia };
    this.modalService.showModal();
  }

  isSelected(hora: string, dia: string): boolean {
    return !!this.selected &&
           this.selected.hora === hora &&
           this.selected.dia === dia;
  }

  // ======== Buscador: lógica demo ========
  private filterCatalogo(q: string): MateriaCatalogo[] {
    const v = q.toLowerCase().trim();
    if (!v) return [];
    return this.materias.filter(m =>
      m.nombre.toLowerCase().includes(v) ||
      m.docente.toLowerCase().includes(v)
    ).slice(0, 8);
  }

  clear() {
    this.searchControl.setValue('');
    this.showDropdown = false;
  }

  select(item: MateriaCatalogo) {
    // Aquí podrías abrir un picker de día/hora y luego setear en schedule:
    // this.schedule.set(this.key(h, d), { nombre: item.nombre, detalle: `${algo}`, cupos: item.cupos, clase: ...})
    // Por ahora, solo rellenamos el input y cerramos sugerencias.
    this.searchControl.setValue(item.nombre);
    this.showDropdown = false;
  }

  selectFirst() {
    // Selecciona la primera sugerencia si existe
    this.suggestions$.subscribe(list => {
      if (list.length) this.select(list[0]);
    }).unsubscribe();
  }
}



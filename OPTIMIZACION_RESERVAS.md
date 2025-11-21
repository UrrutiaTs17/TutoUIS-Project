# 🚀 Optimización de Consultas - Historial de Reservas

## 📊 Problema Identificado: N+1 Query Problem en Reservas

### ❌ Antes (Versión Lenta)

El método `obtenerReservasDtosPorUsuario()` tenía un problema de rendimiento similar al de tutorías:

```
1 query inicial → SELECT * FROM reserva WHERE id_estudiante = ?
+ Intentaba usar JOIN FETCH pero seguía haciendo queries adicionales:
  - 1 query por cada disponibilidad
  - 1 query por cada tutoría
  - 1 query por cada asignatura
  - 1 query por cada tutor

Para 10 reservas = 1 + (10 × 4) = ~41+ consultas SQL
```

**Código antiguo problemático:**
```java
List<Reserva> reservas = reservaRepository.findByIdEstudianteWithDetails(idEstudiante);
return reservas.stream()
        .map(this::convertirAResponseDtoOptimizado)  // Hacía queries adicionales aquí
        .collect(Collectors.toList());
```

### ✅ Después (Versión Optimizada)

```
1 sola query con JOINs → Trae todos los datos de una vez

Para 10 reservas = 1 consulta SQL total
```

## 🔧 Solución Implementada

### 1️⃣ Constructor Completo en `ReservaResponseDto.java`

Se agregó un constructor que acepta todos los campos necesarios:

```java
public ReservaResponseDto(
        Integer idReserva,
        Integer idDisponibilidad,
        LocalTime disponibilidadHoraInicio,
        LocalTime disponibilidadHoraFin,
        Integer idEstudiante,
        String nombreEstudiante,
        Integer idEstado,
        String nombreEstado,
        String observaciones,
        Timestamp fechaCreacion,
        Timestamp fechaCancelacion,
        String razonCancelacion,
        LocalTime horaInicio,
        LocalTime horaFin,
        String nombreAsignatura,
        String nombreTutor) {
    // Inicializa todos los campos
}
```

### 2️⃣ Nuevos Queries Optimizados en `ReservaRepository.java`

#### Query para reservas de UN estudiante:

```java
@Query("""
    SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
        r.idReserva,
        r.idDisponibilidad,
        CAST(d.horaInicio AS LocalTime),
        CAST(d.horaFin AS LocalTime),
        r.idEstudiante,
        CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
        r.idEstado,
        er.nombre,
        r.observaciones,
        r.fechaCreacion,
        r.fechaCancelacion,
        r.razonCancelacion,
        r.horaInicio,
        r.horaFin,
        a.nombre,
        CONCAT(COALESCE(tut.nombre, ''), ' ', COALESCE(tut.apellido, ''))
    )
    FROM Reserva r
    INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
    INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
    INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
    INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
    INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
    INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
    WHERE r.idEstudiante = :idEstudiante
    ORDER BY r.fechaCreacion DESC
""")
List<ReservaResponseDto> findReservasConDetallesPorEstudiante(@Param("idEstudiante") Integer idEstudiante);
```

#### Query para TODAS las reservas:

```java
@Query("""
    SELECT new uis.edu.tutouis_project.modelo.dto.ReservaResponseDto(
        ...mismos campos...
    )
    FROM Reserva r
    INNER JOIN Disponibilidad d ON r.idDisponibilidad = d.idDisponibilidad
    INNER JOIN Tutoria t ON d.idTutoria = t.idTutoria
    INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
    INNER JOIN Usuario tut ON t.idTutor = tut.id_usuario
    INNER JOIN Usuario est ON r.idEstudiante = est.id_usuario
    INNER JOIN EstadoReserva er ON r.idEstado = er.idEstado
    ORDER BY r.fechaCreacion DESC
""")
List<ReservaResponseDto> findAllReservasConDetalles();
```

**Características clave:**
- ✅ 6 INNER JOINs en una sola query
- ✅ `CAST(d.horaInicio AS LocalTime)` para convertir `java.sql.Time` a `LocalTime`
- ✅ `CONCAT` con `COALESCE` para nombres completos sin errores NULL
- ✅ Mapeo directo al constructor del DTO
- ✅ ORDER BY para resultados ordenados

### 3️⃣ Servicio Actualizado - `ReservaService.java`

#### Método para obtener reservas de un estudiante:

```java
@Override
public List<ReservaResponseDto> obtenerReservasDtosPorUsuario(Integer idEstudiante) {
    if (idEstudiante == null || idEstudiante <= 0) {
        throw new IllegalArgumentException("El ID del estudiante debe ser un número positivo");
    }
    
    System.out.println("🔵 ReservaService: Obteniendo reservas del estudiante " + idEstudiante + " [VERSIÓN OPTIMIZADA]");
    long inicio = System.currentTimeMillis();
    
    // Una sola consulta con JOINs - evita el problema N+1
    List<ReservaResponseDto> reservas = reservaRepository.findReservasConDetallesPorEstudiante(idEstudiante);
    
    long fin = System.currentTimeMillis();
    System.out.println("✅ ReservaService: Se obtuvieron " + reservas.size() + 
                       " reservas en " + (fin - inicio) + "ms con UNA sola query SQL");
    
    return reservas;
}
```

#### Método para listar todas las reservas:

```java
@Override
public List<ReservaResponseDto> listarTodasLasReservas() {
    System.out.println("🔵 ReservaService: Listando todas las reservas [VERSIÓN OPTIMIZADA]");
    long inicio = System.currentTimeMillis();
    
    // Una sola consulta con JOINs - evita el problema N+1
    List<ReservaResponseDto> reservas = reservaRepository.findAllReservasConDetalles();
    
    long fin = System.currentTimeMillis();
    System.out.println("✅ ReservaService: Se obtuvieron " + reservas.size() + 
                       " reservas en " + (fin - inicio) + "ms con UNA sola query SQL");
    
    return reservas;
}
```

**Cambios clave:**
- ❌ Eliminado el `stream().map(this::convertirAResponseDto)`
- ❌ Eliminadas todas las llamadas a repositories adicionales
- ✅ Llamada directa al repository optimizado
- ✅ Medición de tiempo para monitoreo
- ✅ Métodos antiguos marcados como `@Deprecated`

## 📈 Mejoras de Rendimiento Esperadas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Queries SQL** | ~41+ | 1 | ~97% menos |
| **Tiempo de respuesta** | >500ms | <50ms | ~90% más rápido |
| **Carga en BD** | Alta | Mínima | ~97% menos |
| **Memoria usada** | Alta | Baja | Menos objetos |
| **Joins en BD** | Múltiples | 1 optimizado | Más eficiente |

## 🔍 Detalles Técnicos

### Relaciones en la Query

```
Reserva
  ├─ JOIN Disponibilidad (on idDisponibilidad)
  │    └─ JOIN Tutoria (on idTutoria)
  │         ├─ JOIN Asignatura (on idAsignatura)
  │         └─ JOIN Usuario AS tutor (on idTutor)
  ├─ JOIN Usuario AS estudiante (on idEstudiante)
  └─ JOIN EstadoReserva (on idEstado)
```

### Conversión de Tipos

**Problema:** `Disponibilidad.horaInicio` es de tipo `java.sql.Time`, pero el DTO espera `java.time.LocalTime`.

**Solución:** Usar `CAST` en JPQL:
```sql
CAST(d.horaInicio AS LocalTime)
CAST(d.horaFin AS LocalTime)
```

### Manejo de NULLs

Usar `COALESCE` para evitar NPE en concatenaciones:
```sql
CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, ''))
```

## 🧪 Cómo Probar

### 1. Verificar en la consola del backend

Al obtener reservas de un usuario:
```
🔵 ReservaService: Obteniendo reservas del estudiante 4 [VERSIÓN OPTIMIZADA]
Hibernate: [UNA SOLA QUERY SQL CON 6 JOINS]
✅ ReservaService: Se obtuvieron 5 reservas en 35ms con UNA sola query SQL
```

### 2. Verificar query SQL en logs

Deberías ver una query similar a:
```sql
SELECT 
    r.id_reserva,
    r.id_disponibilidad,
    CAST(d.hora_inicio AS TIME),
    CAST(d.hora_fin AS TIME),
    r.id_estudiante,
    CONCAT(COALESCE(est.nombre, ''), ' ', COALESCE(est.apellido, '')),
    r.id_estado,
    er.nombre,
    ...
FROM reserva r
INNER JOIN disponibilidad d ON r.id_disponibilidad = d.id_disponibilidad
INNER JOIN tutoria t ON d.id_tutoria = t.id_tutoria
INNER JOIN asignatura a ON t.id_asignatura = a.id_asignatura
INNER JOIN usuario tut ON t.id_tutor = tut.id_usuario
INNER JOIN usuario est ON r.id_estudiante = est.id_usuario
INNER JOIN estado_reserva er ON r.id_estado = er.id_estado
WHERE r.id_estudiante = ?
ORDER BY r.fecha_creacion DESC
```

### 3. Endpoints afectados

```bash
# Obtener reservas de un estudiante específico
GET /api/reservas/usuario/{idEstudiante}

# Listar todas las reservas (administrador)
GET /api/reservas/list
```

## 📝 Métodos Deprecados

Se mantienen por compatibilidad pero están marcados como `@Deprecated`:

1. **`convertirAResponseDto(Reserva)`** - Hacía múltiples queries
2. **`convertirAResponseDtoOptimizado(Reserva)`** - Usaba JOIN FETCH pero aún hacía queries extras
3. **`findByIdEstudianteWithDetails()`** - Repository con JOIN FETCH incompleto

## 🚀 Beneficios Adicionales

### Performance
- ✅ **Menos RTT (Round Trip Time)** a la base de datos
- ✅ **Menos locks** en la BD
- ✅ **Menos carga en conexión pool**

### Mantenibilidad
- ✅ **Código más limpio** en el servicio
- ✅ **Menos conversiones** manuales
- ✅ **Query centralizada** en el repository

### Escalabilidad
- ✅ **Soporta más usuarios** concurrentes
- ✅ **Menos carga** en el servidor
- ✅ **Mejor uso de índices** en BD

## 🎯 Comparación: Antes vs Después

### Antes (con JOIN FETCH parcial)
```java
// Repository
@Query("SELECT DISTINCT r FROM Reserva r " +
       "LEFT JOIN FETCH r.estudiante " +
       "LEFT JOIN FETCH r.estadoReserva " +
       "WHERE r.idEstudiante = :idEstudiante")
List<Reserva> findByIdEstudianteWithDetails(@Param("idEstudiante") Integer idEstudiante);

// Servicio - PROBLEMA: Aún hace queries aquí
List<Reserva> reservas = repository.findByIdEstudianteWithDetails(idEstudiante);
return reservas.stream()
    .map(r -> {
        // ❌ Query para disponibilidad
        disponibilidadRepository.findById(r.getIdDisponibilidad()).ifPresent(d -> {
            // ❌ Query para tutoria
            tutoriaRepository.findById(d.getIdTutoria()).ifPresent(t -> {
                // ... más queries anidadas
            });
        });
    })
    .collect(Collectors.toList());
```

### Después (Query directo a DTO)
```java
// Repository - Todo en una query
@Query("""
    SELECT new ...ReservaResponseDto(...)
    FROM Reserva r
    INNER JOIN Disponibilidad d ...
    INNER JOIN Tutoria t ...
    INNER JOIN Asignatura a ...
    INNER JOIN Usuario tut ...
    INNER JOIN Usuario est ...
    INNER JOIN EstadoReserva er ...
    WHERE r.idEstudiante = :idEstudiante
""")
List<ReservaResponseDto> findReservasConDetallesPorEstudiante(...);

// Servicio - ✅ Sin conversiones, sin queries adicionales
return repository.findReservasConDetallesPorEstudiante(idEstudiante);
```

## ✅ Checklist de Implementación

- [x] Agregar constructor completo a ReservaResponseDto
- [x] Crear query optimizado para reservas por estudiante
- [x] Crear query optimizado para todas las reservas
- [x] Actualizar ReservaService.obtenerReservasDtosPorUsuario()
- [x] Actualizar ReservaService.listarTodasLasReservas()
- [x] Marcar métodos antiguos como @Deprecated
- [x] Compilación exitosa
- [x] Manejo correcto de conversión Time → LocalTime

## 📚 Lecciones Aprendidas

1. **JOIN FETCH no es suficiente** si después se hacen más queries
2. **Query directo a DTO** es la solución más eficiente
3. **CAST en JPQL** permite conversiones de tipo
4. **COALESCE** previene errores con valores NULL
5. **Medición de tiempo** ayuda a verificar mejoras

---

**Fecha de optimización**: 21 de noviembre de 2025  
**Autor**: William Urrutia  
**Módulo**: Historial de Reservas  
**Versión**: 1.0

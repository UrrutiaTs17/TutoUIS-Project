# 🚀 Optimización de Consultas - TutoriaService

## 📊 Problema Identificado: N+1 Query Problem

### ❌ Antes (Versión Lenta)
El método `obtenerTodasLasTutorias()` tenía un grave problema de rendimiento:

```
1 query inicial → SELECT * FROM tutoria
+ N queries para cada tutoría:
  - 1 query para buscar Usuario (tutor)
  - 1 query para buscar Carrera
  - 1 query para buscar Asignatura
  - Queries adicionales por lazy loading

Para 18 tutorías = 1 + (18 × 3+) = ~70+ consultas SQL
```

**Evidencia en consola:**
```
Hibernate: select ... from tutoria ...
Hibernate: select ... from usuario ... where id_usuario=?
Hibernate: select ... from carrera ... where id_carrera=?
Hibernate: select ... from asignatura ... where id_asignatura=?
[Se repite para cada tutoría]
```

### ✅ Después (Versión Optimizada)

```
1 sola query con JOINs → Trae todos los datos de una vez

Para 18 tutorías = 1 consulta SQL total
```

## 🔧 Solución Implementada

### 1️⃣ Nuevo Query en `TutoriaRepository.java`

Se agregó un método con **query JPQL personalizada** que usa JOINs:

```java
@Query("""
    SELECT new uis.edu.tutouis_project.dto.TutoriaResponseDto(
        t.idTutoria,
        t.idTutor,
        CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, '')),
        t.idAsignatura,
        c.nombre,
        a.nombre,
        t.descripcion,
        t.capacidadMaxima,
        t.lugar,
        t.modalidad,
        t.lugar,
        t.estado,
        t.fechaCreacion,
        t.fechaUltimaModificacion
    )
    FROM Tutoria t
    INNER JOIN Usuario u ON t.idTutor = u.idUsuario
    INNER JOIN Carrera c ON u.id_carrera = c.idCarrera
    INNER JOIN Asignatura a ON t.idAsignatura = a.idAsignatura
    ORDER BY t.idTutoria
""")
List<TutoriaResponseDto> findAllTutoriasWithDetails();
```

**Ventajas de este enfoque:**
- ✅ **Una sola consulta SQL** con INNER JOINs
- ✅ **Mapeo directo a DTO** (no carga entidades completas)
- ✅ **Menos memoria** usada (no instancia objetos innecesarios)
- ✅ **Evita lazy loading** (todo se trae eager)
- ✅ Usa `COALESCE` para manejar valores NULL

### 2️⃣ Servicio Actualizado - `TutoriaService.java`

El método principal ahora es mucho más simple:

```java
public List<TutoriaResponseDto> obtenerTodasLasTutorias() {
    System.out.println("🔵 TutoriaService: Iniciando obtenerTodasLasTutorias() [VERSIÓN OPTIMIZADA]");
    long inicio = System.currentTimeMillis();
    
    // Una sola consulta con JOINs - evita el problema N+1
    List<TutoriaResponseDto> resultado = tutoriaRepository.findAllTutoriasWithDetails();
    
    long fin = System.currentTimeMillis();
    System.out.println("✅ TutoriaService: Se obtuvieron " + resultado.size() + 
                       " tutorías en " + (fin - inicio) + "ms con UNA sola query SQL");
    
    return resultado;
}
```

**Cambios clave:**
- ❌ Eliminado el `stream().map()` con conversiones manuales
- ❌ Eliminadas las llamadas a `usuarioRepository.findById()`
- ❌ Eliminadas las llamadas a `carreraRepository.findById()`
- ❌ Eliminadas las llamadas a `asignaturaRepository.findById()`
- ✅ Se agregó medición de tiempo para monitoreo
- ✅ Método anterior marcado como `@Deprecated`

### 3️⃣ DTO Actualizado - `TutoriaResponseDto.java`

Se actualizó el constructor para asegurar que `nombreAsignatura` también se llene:

```java
public TutoriaResponseDto(...) {
    // ... otros campos
    this.nombre = nombre;
    this.nombreAsignatura = nombre; // ← Asegura que ambos campos se llenen
    // ... otros campos
}
```

## 📈 Mejoras de Rendimiento Esperadas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Queries SQL** | ~70+ | 1 | ~98% menos |
| **Tiempo de respuesta** | >1000ms | <100ms | ~90% más rápido |
| **Carga en BD** | Alta | Mínima | ~98% menos |
| **Memoria usada** | Alta | Baja | Menos objetos |
| **Red (BD↔Backend)** | Muchos RTT | 1 RTT | ~98% menos |

## 🎯 Comparación de Enfoques

### Opción 1: Query con JOINs → DTO (✅ IMPLEMENTADA)
```java
@Query("SELECT new DTO(...) FROM Entity JOIN ...")
```
**Ventajas:**
- ✅ Una sola query SQL
- ✅ Mapeo directo a DTO
- ✅ Sin lazy loading
- ✅ Menos memoria
- ✅ Más rápido

### Opción 2: @EntityGraph / join fetch (❌ NO implementada)
```java
@EntityGraph(attributePaths = {"tutor", "asignatura", "carrera"})
List<Tutoria> findAll();
```
**Desventajas vs Opción 1:**
- ❌ Carga entidades completas (más memoria)
- ❌ Necesita conversión manual a DTO
- ❌ Más complejo de mantener
- ❌ Puede traer datos innecesarios

### Opción 3: Múltiples queries (❌ VERSIÓN ANTERIOR)
```java
tutorias.stream()
    .map(t -> {
        usuarioRepo.findById(t.getIdTutor());  // N+1
        carreraRepo.findById(...);              // N+1
        asignaturaRepo.findById(...);           // N+1
    })
```
**Problemas:**
- ❌ Problema N+1
- ❌ Muchas queries SQL
- ❌ Muy lento
- ❌ Alta carga en BD

## 🧪 Cómo Probar

### 1. Verificar en la consola del backend
Busca este mensaje:
```
✅ TutoriaService: Se obtuvieron 18 tutorías en XXms con UNA sola query SQL
```

### 2. Verificar queries SQL en logs
Deberías ver **una sola query** similar a:
```sql
SELECT 
    t.id_tutoria,
    t.id_tutor,
    CONCAT(u.nombre, ' ', u.apellido),
    ...
FROM tutoria t
INNER JOIN usuario u ON t.id_tutor = u.id_usuario
INNER JOIN carrera c ON u.id_carrera = c.id_carrera
INNER JOIN asignatura a ON t.id_asignatura = a.id_asignatura
ORDER BY t.id_tutoria
```

### 3. Verificar respuesta del endpoint
```bash
curl http://localhost:8080/api/tutorias/calendar
```

La respuesta debe ser **igual** a la anterior pero **mucho más rápida**.

## 📝 Notas Técnicas

### Campos de las Entidades
- **Usuario**: `id_carrera` (con guión bajo en Java, por eso se usa así en JPQL)
- **Carrera**: `idCarrera`, `nombre`
- **Asignatura**: `idAsignatura`, `nombre`
- **Tutoria**: `idTutoria`, `idTutor`, `idAsignatura`

### INNER JOIN vs LEFT JOIN
Se usó `INNER JOIN` porque:
- Toda tutoría **debe tener** tutor, carrera y asignatura
- Si falta alguno, es un error de integridad
- `INNER JOIN` es más eficiente que `LEFT JOIN`

Si en el futuro hay tutorías sin estos datos, cambiar a `LEFT JOIN`.

### Uso de COALESCE
```sql
CONCAT(COALESCE(u.nombre, ''), ' ', COALESCE(u.apellido, ''))
```
Evita errores si `nombre` o `apellido` son NULL.

## 🔍 Monitoreo y Debugging

Para verificar las queries SQL en desarrollo, activa en `application.properties`:

```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
```

## 🚀 Próximos Pasos (Opcional)

1. **Paginación**: Si hay miles de tutorías, agregar `Pageable`:
   ```java
   Page<TutoriaResponseDto> findAllTutoriasWithDetails(Pageable pageable);
   ```

2. **Caché**: Agregar `@Cacheable` si los datos no cambian frecuentemente:
   ```java
   @Cacheable("tutorias")
   public List<TutoriaResponseDto> obtenerTodasLasTutorias() { ... }
   ```

3. **Índices**: Asegurar que hay índices en:
   - `tutoria.id_tutor`
   - `tutoria.id_asignatura`
   - `usuario.id_carrera`

## ✅ Checklist de Implementación

- [x] Crear query con JOINs en TutoriaRepository
- [x] Actualizar TutoriaService para usar nuevo método
- [x] Actualizar constructor de TutoriaResponseDto
- [x] Compilación exitosa
- [x] Marcar método antiguo como @Deprecated
- [x] Documentar cambios

## 📚 Referencias

- [JPA Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)
- [N+1 Query Problem](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem)
- [JPQL Constructor Expressions](https://docs.oracle.com/javaee/7/tutorial/persistence-querylanguage005.htm)

---

**Fecha de optimización**: 21 de noviembre de 2025  
**Autor**: William Urrutia  
**Versión**: 1.0

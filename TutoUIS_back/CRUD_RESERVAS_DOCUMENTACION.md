# CRUD de Reservaciones - Documentación Completa

## Resumen de Implementación

Se ha completado e implementado un CRUD profesional para gestionar **Reservaciones** en el sistema TutoUIS. La implementación sigue las mejores prácticas de Spring Boot y separación de responsabilidades.

## Componentes Creados/Mejorados

### 1. **Modelos (Modelo)**

#### Reserva.java (Mejorado)
- ✅ Agregadas relaciones JPA con `@ManyToOne`
- ✅ Relaciones con: `Disponibilidad`, `Estudiante`, `EstadoReserva`
- ✅ Configuradas con `@JsonBackReference` para evitar referencia circular
- ✅ Getters y setters completos

### 2. **DTOs (Data Transfer Objects)**

#### CreateReservaDto.java (Nuevo)
```java
- idDisponibilidad* : Integer (required, positive)
- idEstudiante* : Integer (required, positive)
- observaciones : String (optional)
```

#### UpdateReservaDto.java (Nuevo)
```java
- observaciones : String (optional)
- razonCancelacion : String (optional)
```

#### ReservaResponseDto.java (Nuevo)
```java
- idReserva : Integer
- idDisponibilidad : Integer
- idEstudiante : Integer
- idEstado : Integer
- nombreEstado : String
- observaciones : String
- fechaCreacion : Timestamp
- fechaCancelacion : Timestamp
- razonCancelacion : String
```

### 3. **Repositorio (ReservaRepository)**

Métodos mejorados:
- ✅ `findByIdEstudiante()` - Buscar por estudiante
- ✅ `findByIdDisponibilidad()` - Buscar por disponibilidad
- ✅ `findByIdEstado()` - Buscar por estado
- ✅ `findByIdEstudianteAndIdEstado()` - Buscar por estudiante y estado
- ✅ `findReservaActivaDeEstudianteEnDisponibilidad()` - Verificar duplicados
- ✅ `countReservasActivasPorDisponibilidad()` - Contar activas
- ✅ `findReservasRealizadasDeEstudiante()` - Reservas completadas
- ✅ `findReservasNoAsistidasDeEstudiante()` - Reservas no asistidas

### 4. **Servicio (ReservaService)**

#### IReservaService.java (Interfaz)
Define contrato para:
- Obtener todas las reservas
- Obtener por ID
- Obtener por estudiante (con filtros)
- Obtener por disponibilidad
- Crear reserva (con validaciones)
- Actualizar reserva
- Cancelar reserva (con liberación de cupo)
- Marcar como realizada
- Marcar como no asistida
- Eliminar reserva

#### ReservaService.java (Implementación)
- ✅ Validaciones de entrada
- ✅ Lógica de negocio completa
- ✅ Manejo de estados
- ✅ Control de aforo disponible
- ✅ Prevención de duplicados
- ✅ Conversión a DTOs

### 5. **Controlador (ReservaController)**

Endpoints implementados:

#### GET
- `GET /api/reservas/list` - Listar todas las reservas
- `GET /api/reservas/{id}` - Obtener por ID
- `GET /api/reservas/estudiante/{idEstudiante}` - Mis reservas
- `GET /api/reservas/estudiante/{idEstudiante}/activas` - Mis reservas activas
- `GET /api/reservas/disponibilidad/{idDisponibilidad}` - Reservas de una disponibilidad

#### POST
- `POST /api/reservas/` - Crear nueva reserva

#### PUT
- `PUT /api/reservas/{id}` - Actualizar observaciones
- `PUT /api/reservas/{id}/cancelar` - Cancelar con razón
- `PUT /api/reservas/{id}/realizada` - Marcar como realizada
- `PUT /api/reservas/{id}/no-asistida` - Marcar como no asistida

#### DELETE
- `DELETE /api/reservas/{id}` - Eliminar reserva

## Características Principales

### Validaciones
✅ Verificación de disponibilidad existente
✅ Verificación de cupos disponibles
✅ Verificación de estudiante existente
✅ Prevención de reservas duplicadas activas
✅ Validación de IDs positivos
✅ Validación de DTOs con `@Valid`

### Lógica de Negocio
✅ Decremento automático de aforo al crear reserva
✅ Incremento automático de aforo al cancelar
✅ Control de estados de reserva (Reservada, Cancelada, Realizada, No Asistida)
✅ Trazabilidad con timestamps
✅ Manejo de razones de cancelación

### Manejo de Errores
✅ Códigos HTTP apropiados (201, 400, 404, 500)
✅ Mensajes de error descriptivos
✅ Respuestas JSON con detalles
✅ Logging de excepciones

### Documentación
✅ Anotaciones Swagger/OpenAPI
✅ Descripciones de operaciones
✅ Esquemas de respuesta
✅ Requerimientos de seguridad (JWT)
✅ Ejemplos en comentarios

## Estados de Reserva

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | Reservada | Reserva confirmada y activa |
| 2 | Cancelada | Reserva cancelada por estudiante/admin |
| 3 | Realizada | Tutoría completada |
| 4 | No Asistida | Estudiante no asistió |

## Flujo de Creación de Reserva

```
1. Cliente envía POST /api/reservas/ con CreateReservaDto
2. Servicio valida que:
   - Disponibilidad existe
   - Hay cupos disponibles
   - Estudiante existe
   - No hay reserva activa previa
3. Se crea Reserva con estado=1 (Reservada)
4. Se decrementa aforo_disponible en 1
5. Se retorna ReservaResponseDto con datos completos
```

## Flujo de Cancelación

```
1. Cliente envía PUT /api/reservas/{id}/cancelar con razonCancelacion
2. Servicio valida:
   - Reserva existe
   - Reserva no está ya cancelada
3. Se actualiza estado a 2 (Cancelada)
4. Se incrementa aforo_disponible en 1
5. Se retorna ReservaResponseDto actualizado
```

## Ejemplo de Uso - cURL

### Crear Reserva
```bash
curl -X POST http://localhost:8080/api/reservas/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idDisponibilidad": 1,
    "idEstudiante": 4,
    "observaciones": "Necesito reforzar Java"
  }'
```

### Obtener Mis Reservas
```bash
curl -X GET http://localhost:8080/api/reservas/estudiante/4 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Cancelar Reserva
```bash
curl -X PUT http://localhost:8080/api/reservas/1/cancelar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razonCancelacion": "No puedo asistir por enfermedad"
  }'
```

### Marcar como Realizada
```bash
curl -X PUT http://localhost:8080/api/reservas/1/realizada \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Respuesta Exitosa (201 Created)

```json
{
  "idReserva": 1,
  "idDisponibilidad": 1,
  "idEstudiante": 4,
  "idEstado": 1,
  "nombreEstado": "Reservada",
  "observaciones": "Necesito reforzar Java",
  "fechaCreacion": "2025-11-07T10:30:00",
  "fechaCancelacion": null,
  "razonCancelacion": null
}
```

## Respuesta de Error (400 Bad Request)

```json
{
  "mensaje": "No hay cupos disponibles en esta tutoría"
}
```

## Próximos Pasos Sugeridos

1. **Frontend Angular**: Crear servicio y componentes para gestionar reservas
2. **Validaciones Adicionales**: Agregar validaciones de horarios solapados
3. **Notificaciones**: Implementar notificaciones cuando se cancelen reservas
4. **Reportes**: Agregar reportes de asistencia por tutor/estudiante
5. **Testing**: Crear tests unitarios e integración para los servicios
6. **Paginación**: Agregar paginación en listados de reservas

## Archivos Creados/Modificados

```
✅ modelo/Reserva.java - MODIFICADO
✅ modelo/dto/CreateReservaDto.java - CREADO
✅ modelo/dto/UpdateReservaDto.java - CREADO
✅ modelo/dto/ReservaResponseDto.java - CREADO
✅ repositorio/ReservaRepository.java - MEJORADO
✅ servicio/IReservaService.java - CREADO
✅ servicio/ReservaService.java - CREADO
✅ controlador/ReservaController.java - COMPLETAMENTE REFACTORIZADO
```

---

**Implementación completada**: 7 de noviembre de 2025
**Versión**: 1.0
**Estado**: ✅ Listo para usar

# ⚡ REFERENCIA RÁPIDA - CRUD Reservaciones

## 🔑 Token JWT

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"codigo":"julian2233","contrasena":"password123"}'
```

Guardar token en variable:
```bash
TOKEN="token_aquí"
```

---

## 📝 CRUD Rápido

### 1️⃣ CREATE - Crear Reserva
```bash
curl -X POST http://localhost:8080/api/reservas/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idDisponibilidad": 1,
    "idEstudiante": 9,
    "observaciones": "Mi observación"
  }'
```
**Respuesta**: 201 Created + objeto Reserva

---

### 2️⃣ READ - Obtener Reservas

**Todas:**
```bash
curl http://localhost:8080/api/reservas/list \
  -H "Authorization: Bearer $TOKEN"
```

**Por ID:**
```bash
curl http://localhost:8080/api/reservas/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Mis reservas:**
```bash
curl http://localhost:8080/api/reservas/estudiante/9 \
  -H "Authorization: Bearer $TOKEN"
```

**Mis activas:**
```bash
curl http://localhost:8080/api/reservas/estudiante/9/activas \
  -H "Authorization: Bearer $TOKEN"
```

**Por disponibilidad:**
```bash
curl http://localhost:8080/api/reservas/disponibilidad/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3️⃣ UPDATE - Actualizar Reserva

**Observaciones:**
```bash
curl -X PUT http://localhost:8080/api/reservas/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"observaciones":"Nueva observación"}'
```

**Cancelar:**
```bash
curl -X PUT http://localhost:8080/api/reservas/1/cancelar \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"razonCancelacion":"Por enfermedad"}'
```

**Marcar realizada:**
```bash
curl -X PUT http://localhost:8080/api/reservas/1/realizada \
  -H "Authorization: Bearer $TOKEN"
```

**Marcar no asistida:**
```bash
curl -X PUT http://localhost:8080/api/reservas/1/no-asistida \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4️⃣ DELETE - Eliminar Reserva
```bash
curl -X DELETE http://localhost:8080/api/reservas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Estados

| ID | Nombre | Código |
|----|--------|--------|
| 1 | Reservada | `RESERVADA` |
| 2 | Cancelada | `CANCELADA` |
| 3 | Realizada | `REALIZADA` |
| 4 | No Asistida | `NO_ASISTIDA` |

---

## 🗂️ DTOs

### CreateReservaDto
```json
{
  "idDisponibilidad": 1,
  "idEstudiante": 9,
  "observaciones": "opcional"
}
```

### UpdateReservaDto
```json
{
  "observaciones": "nueva observación"
}
```

### ReservaResponseDto
```json
{
  "idReserva": 1,
  "idDisponibilidad": 1,
  "idEstudiante": 9,
  "idEstado": 1,
  "nombreEstado": "Reservada",
  "observaciones": "texto",
  "fechaCreacion": "2025-11-07T10:30:00",
  "fechaCancelacion": null,
  "razonCancelacion": null
}
```

---

## ✅ Códigos HTTP

| Código | Significado |
|--------|------------|
| **200** | OK - Operación exitosa |
| **201** | Created - Recurso creado |
| **400** | Bad Request - Datos inválidos |
| **401** | Unauthorized - Sin autenticación |
| **404** | Not Found - Recurso no encontrado |
| **500** | Server Error - Error interno |

---

## 🚨 Errores Comunes

| Error | Solución |
|-------|----------|
| "No hay cupos disponibles" | Seleccionar otra disponibilidad |
| "Disponibilidad no encontrada" | Verificar ID disponibilidad correcto |
| "Estudiante no encontrado" | Verificar ID estudiante correcto |
| "Ya tienes una reserva activa" | Cancelar la anterior primero |
| "401 Unauthorized" | Obtener nuevo token JWT |

---

## 🔗 Rutas del Controlador

```
GET     /api/reservas/list
GET     /api/reservas/{id}
GET     /api/reservas/estudiante/{idEstudiante}
GET     /api/reservas/estudiante/{idEstudiante}/activas
GET     /api/reservas/disponibilidad/{idDisponibilidad}
POST    /api/reservas/
PUT     /api/reservas/{id}
PUT     /api/reservas/{id}/cancelar
PUT     /api/reservas/{id}/realizada
PUT     /api/reservas/{id}/no-asistida
DELETE  /api/reservas/{id}
```

---

## 📚 Archivos Documentación

| Archivo | Contenido |
|---------|----------|
| `RESUMEN_EJECUTIVO_RESERVAS.md` | Resumen general |
| `CRUD_RESERVAS_DOCUMENTACION.md` | Documentación técnica |
| `GUIA_INTEGRACION_FRONTEND_RESERVAS.md` | Angular/Frontend |
| `GUIA_PRUEBAS_RESERVAS.md` | Pruebas detalladas |
| `REFERENCIA_RAPIDA_RESERVAS.md` | Este archivo |

---

## 💾 Base de Datos

### Tabla principal
```sql
SELECT * FROM reserva;
```

### Ver disponibilidades
```sql
SELECT * FROM disponibilidad;
```

### Ver estados
```sql
SELECT * FROM estado_reserva;
```

---

## 🎯 Flujo Típico Usuario

```
1. Autenticarse           → Obtener TOKEN
2. Ver disponibilidades   → GET /api/disponibilidades/list
3. Crear reserva          → POST /api/reservas/
4. Ver mis reservas       → GET /api/reservas/estudiante/{id}
5. Cancelar si es necesario → PUT /api/reservas/{id}/cancelar
```

---

## 🎯 Flujo Típico Tutor

```
1. Autenticarse           → Obtener TOKEN
2. Ver todas reservas     → GET /api/reservas/list
3. Ver por disponibilidad → GET /api/reservas/disponibilidad/{id}
4. Marcar realizada       → PUT /api/reservas/{id}/realizada
5. Marcar no asistida     → PUT /api/reservas/{id}/no-asistida
```

---

## 🎯 Flujo Típico Admin

```
1. Autenticarse           → Obtener TOKEN
2. Ver todas reservas     → GET /api/reservas/list
3. Gestionar reservas     → Ver/Actualizar/Eliminar según sea necesario
4. Análisis de datos      → Consultas SQL avanzadas
```

---

## 🚀 Postman Collection URL

Para importar en Postman:
```
Crear colección manual o importar desde:
BASE_URL: http://localhost:8080
Auth: Bearer {{token}}
```

---

## 📱 Swift/iOS Request (si aplica)

```swift
let url = URL(string: "http://localhost:8080/api/reservas/")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
request.setValue("application/json", forHTTPHeaderField: "Content-Type")

let body = [
  "idDisponibilidad": 1,
  "idEstudiante": 9,
  "observaciones": "Mi observación"
]
request.httpBody = try? JSONSerialization.data(withJSONObject: body)

URLSession.shared.dataTask(with: request).resume()
```

---

## 📊 Resumen Endpoints

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | `/list` | Todas |
| GET | `/{id}` | Por ID |
| GET | `/estudiante/{id}` | Del estudiante |
| GET | `/estudiante/{id}/activas` | Activas |
| GET | `/disponibilidad/{id}` | Por disponibilidad |
| POST | `/` | Crear |
| PUT | `/{id}` | Actualizar |
| PUT | `/{id}/cancelar` | Cancelar |
| PUT | `/{id}/realizada` | Marcar realizada |
| PUT | `/{id}/no-asistida` | Marcar no asistida |
| DELETE | `/{id}` | Eliminar |

---

**Versión**: 1.0  
**Fecha**: 7 de noviembre de 2025  
**Estado**: ✅ Listo para usar

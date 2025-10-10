# Copilot Instructions for TutoUIS-Project

## Arquitectura General
- Proyecto Angular con estructura modular en `src/app`.
- Componentes principales: `header`, `footer` (en `src/app/components/`), y páginas como `calendar`, `home`, `login` (en `src/app/pages/`).
- El archivo de entrada es `src/main.ts`. El servidor se configura en `src/server.ts` y `src/main.server.ts`.
- Configuraciones y rutas separadas para cliente y servidor (`app.config.ts`, `app.config.server.ts`, `app.routes.ts`, `app.routes.server.ts`).

## Flujos de Desarrollo
- **Compilación y ejecución:**
  - Usar `npm start` para levantar el servidor de desarrollo.
  - Usar `npm test` para ejecutar pruebas.
- **Archivos de configuración clave:**
  - `angular.json`, `tsconfig.json`, `package.json`.
- **Estilos:**
  - CSS modular por componente/página.
  - Archivo global de estilos en `src/styles.css`.

## Convenciones y Patrones
- Componentes y páginas siguen la convención: carpeta con mismo nombre, archivos `{name}.ts`, `{name}.html`, `{name}.css`.
- Separación clara entre lógica de presentación (componentes) y páginas (vistas).
- Las rutas y configuración del servidor están duplicadas para SSR y cliente.
- No se detectan servicios personalizados ni integración directa con APIs externas en la estructura actual.

## Integraciones y Dependencias
- Dependencias gestionadas vía `package.json`.
- No se detectan integraciones externas directas (API REST, bases de datos) en el código fuente, pero el diseño de base de datos está documentado en la imagen PNG.

## Ejemplo de patrón de componente
```
src/app/components/header/
  header.ts      // Lógica del componente
  header.html    // Vista
  header.css     // Estilos
```

## Recomendaciones para agentes AI
- Mantener la estructura modular y las convenciones de nombres.
- Actualizar rutas y configuraciones en ambos archivos (`.server.ts` y normal) al modificar navegación o SSR.
- Revisar `angular.json` y `package.json` antes de agregar dependencias o scripts.
- Usar los comandos npm definidos para flujos de desarrollo.

¿Falta alguna convención, integración o flujo importante? Indica detalles para mejorar estas instrucciones.
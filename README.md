# Taller 08 · Órdenes de mantenimiento

Continuación del mismo escenario y repositorio de los talleres 06 y 07. Conserva el servicio con signal, doce órdenes, formulario reactivo y buscador.

## Ejecutar

```sh
npm ci
npx ng serve
npx ng build
```

Abrir http://localhost:4200. Los datos viven en memoria: F5 restaura la semilla. No se usan HttpClient, guards ni NgModule.

## Tabla A de rutas

| Ruta | Vista | Parámetro o carga |
| --- | --- | --- |
| / | Redirección a /ordenes | pathMatch: full |
| /ordenes | Listado | ?estado=… recibido con input() |
| /ordenes/nueva | Alta | router.navigate al detalle creado |
| /ordenes/:id | Detalle | id = input.required<string>() y computed |
| /estadisticas | Estadisticas | loadComponent e import dinámico |
| ** | NoEncontrada | router.url y enlace de regreso |

La ruta nueva aparece antes de :id y el comodín es el último. Cada ruta tiene title. El menú usa routerLink y routerLinkActive; Nueva orden tiene exact: true y Órdenes permanece activo en detalles, sin activarse en el alta. Se retiró Inicio a petición del usuario porque repetía el listado. Hay un solo router-outlet. La consulta está antes del listado. Estadísticas mantiene loadComponent y muestra conteos, porcentajes, horas y tipos calculados desde el servicio con signal.

## Nueve casos y validación

Resultados esperados registrados antes de ejecutar en docs/t08-esperados.json. Ejecutar C1 a C9 en orden con una carga nueva. C8 crea la orden 13 y deja seis pendientes; comprobar mediante enlaces sin F5. Para C9 abrir F12 > Red y filtrar JS antes de la primera visita a Estadísticas; volver al listado y entrar de nuevo para comprobar que no se solicita otra vez el archivo diferido.

El compilador Angular (ngc -p tsconfig.app.json --noEmit) pasó sin errores. npx ng build y ng serve están bloqueados por spawn EPERM al iniciar esbuild en el entorno de edición. Los casos de navegador, capturas C5/C9 y acceso privado quedan pendientes; no se presentan como aprobados.

Las capturas e informes T08 quedan fuera del repositorio. Las imágenes T07 ya existentes en el historial no son evidencias nuevas de T08.

Repositorio: https://github.com/SapoTurco/com30-taller06-Garrido

Rama local para revisión: codex/taller08-rutas. Cambios sin subir.

# Taller 07 · Órdenes de mantenimiento

Ampliación del mismo escenario y repositorio del Taller 06. Se conserva el formulario reactivo con validadores, tareas dinámicas, creación, cambio de estado y eliminación de órdenes. Se agrega la búsqueda reactiva de la S08.

## Ejecutar

Requisitos: Node.js compatible con Angular 21 y npm.

```sh
npm ci
npx ng serve
```

Abrir http://localhost:4200. Compilar con `npx ng build`; salida en `dist/demo/browser`. No se usan rutas, HttpClient, servidor externo ni almacenamiento persistente. Al recargar vuelven las 12 órdenes y el contador queda en cero.

## Datos y búsqueda

La tabla A corresponde a `src/app/models/semilla.ts`: 12 órdenes, con estados Pendiente, En proceso y Finalizada. Se consulta **equipo, tipo, tecnico y descripcion**. Basta que cualquiera contenga el texto, ignorando tildes y mayúsculas. `zzz` no existe.

`RegistroService.buscar(texto)` devuelve un Observable frío. Cuenta una llamada por suscripción y retrasa la respuesta `Math.max(150, 1500 - 300 * texto.trim().length)` ms. Una llamada cancelada también cuenta. Menos de dos caracteres no consulta. `llamadas` usa `asReadonly()`.

`Buscador` procesa `valueChanges` con `map(trim)`, `debounceTime(300)`, `distinctUntilChanged()` y `switchMap`. Para textos cortos devuelve `of([])`. `toSignal` entrega el resultado con valor inicial vacío. Un filtro signal y un computed producen los resultados visibles; total y conteos por estado son computed sobre esos resultados.

El historial guarda las cinco consultas enviadas más recientes, incluidas las canceladas, con la más reciente primero. No guarda textos cortos ni repeticiones consecutivas descartadas. Su suscripción usa `takeUntilDestroyed()`. Solo se comparte el flujo de textos; el historial no duplica consultas al servicio. `catchError` y `finalize` están dentro de `switchMap` para conservar la búsqueda y cerrar la carga ante error o cancelación.

Los cambios de estado y las eliminaciones se reflejan sin nuevas consultas. Para buscar una orden recién creada, cambia el texto. Los datos viven en memoria.

## Pruebas y evidencia

`docs/casos-esperados.json` y `docs/plan-pruebas.md` se escribieron antes de ejecutar. `docs/resultados-pruebas.json` contiene resultados reales. Los contadores de C1 a C9 son **1, 2, 3, 3, 3, 4, 5, 6, 8**.

C9: escribir `mo`, esperar 400 ms y completar `motor` en menos de 300 ms. `mo` coincide con 9 órdenes y tarda 900 ms; `motor` coincide con 7 y tarda 150 ms. Quedan los IDs 1–7 y ocho llamadas. Captura: `docs/evidencias/C9.png`.

También se verificaron tildes y mayúsculas, código y tipo, historial limitado a cinco, carga, filtros, formulario T06, cambio de estado, eliminación y móvil.

Para reproducir las pruebas, inicia la aplicación y sigue C1 a C9 en el orden indicado en `docs/casos-esperados.json`, partiendo de una recarga para que el contador esté en cero.

## Correspondencia con el enunciado

| Requisito | Implementación |
| --- | --- |
| R1 | `registro.service.ts`, `models/semilla.ts` |
| R2 y R3 | `buscador.ts`: tubería, switchMap, carga y cancelación |
| R4 y R5 | `buscador.ts`: resultados, visibles, total y porEstado |
| R6 | `buscador.ts`: historial y takeUntilDestroyed |
| R7 | Plantilla del buscador: mensajes, track y @empty |
| R8 | Commits T07, README, tablas, evidencias e informe |

Referencia técnica del Word: ejemplos 4, 5 y 8 de `kevindealbap10/iubclass`, rama master. Se usa el retardo exigido por el enunciado del taller.

Repositorio: https://github.com/SapoTurco/com30-taller06-Garrido

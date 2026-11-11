# Tabla B preparada antes de ejecutar

Los resultados esperados están registrados en `casos-esperados.json` antes de correr las pruebas. Ejecutar C1 a C9 en orden, con el contador inicialmente en cero; esperar la respuesta de cada caso. En C7 volver a Todos antes de C8. Los IDs corresponden a la tabla A de la semilla, no a los códigos del ejemplo de reservas del enunciado.

En C9, `mo` encuentra nueve órdenes: siete con motor y dos con módulo. `motor` encuentra solo siete. La primera consulta tarda 900 ms; la segunda 150 ms. Se deja salir la primera esperando 400 ms desde la escritura; después se completa motor rápidamente. Al terminar debe conservarse motor, incluso tras el instante en que habría llegado mo. Las dos llamadas cuentan, aunque una se cancele.

Verificaciones adicionales: tildes y mayúsculas (`VALVULA`, `ANDRES`), búsqueda por código y tipo, historial limitado a cinco, estados de carga, edición/eliminación del Taller 06, formulario con validadores, versión móvil y compilación de producción.

import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { M, PATRON_CODIGO, TOPE } from './parametros';

@Component({
  selector: 'app-detalle-solicitud',
  imports: [RouterLink],
  template: `
    <main class="page-shell">
      <div class="hero"><h1>Detalle de la solicitud</h1></div>
      <section class="panel detail-panel" aria-label="Datos de la solicitud">
        @if (!codigoValido()) {
          <p role="alert">Código inválido</p>
        } @else if (resumen(); as datos) {
          <dl>
            <dt>Código</dt><dd>{{ codigo() }}</dd>
            <dt>Cantidad</dt><dd>{{ datos.cantidad }}</dd>
            <dt>Bloques</dt><dd>{{ datos.bloques }}</dd>
            <dt>Margen</dt><dd>{{ datos.margen }}</dd>
          </dl>
        } @else {
          <p role="alert">La cantidad de la solicitud falta o es inválida.</p>
        }
        <a routerLink="/parcial2">Volver a la solicitud</a>
      </section>
    </main>
  `,
})
export class DetalleSolicitud {
  readonly codigo = input.required<string>();
  readonly cantidad = input(NaN, { transform: numberAttribute });
  readonly codigoValido = computed(() => PATRON_CODIGO.test(this.codigo()));
  readonly resumen = computed(() => {
    const cantidad = this.cantidad();
    if (cantidad < 1 || cantidad > TOPE || cantidad % M !== 0) return null;

    return { cantidad, bloques: cantidad / M, margen: TOPE - cantidad };
  });
}

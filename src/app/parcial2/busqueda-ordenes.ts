import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, scan } from 'rxjs';
import { coincide } from '../models/semilla';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-busqueda-ordenes',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="orders-section" aria-labelledby="ordenes-parcial">
      <h2 id="ordenes-parcial">Órdenes registradas</h2>
      <div class="search-panel">
        <div class="field">
          <label for="buscar">Buscar</label>
          <input id="buscar" type="search" [formControl]="buscar" autocomplete="off">
        </div>
        <div class="search-status" role="status">
          <div>Último valor: {{ consulta().valor || '—' }}</div>
          <div>Emisiones: {{ consulta().emisiones }}</div>
        </div>
      </div>
      <div class="orders-list">
        @for (orden of visibles(); track orden.id) {
          <article class="order-card">
            <div class="order-marker">{{ orden.id }}</div>
            <div class="order-main">
              <h3><a [routerLink]="['/ordenes', orden.id]">Orden {{ orden.id }} · {{ orden.equipo }}</a></h3>
              <p>{{ orden.tipo }} · {{ orden.tecnico }}</p>
              <p>{{ orden.descripcion }}</p>
            </div>
          </article>
        } @empty {
          <p class="empty-orders">Sin coincidencias.</p>
        }
      </div>
    </section>
  `,
})
export class BusquedaOrdenes {
  private readonly registro = inject(RegistroService);
  readonly buscar = new FormControl('', { nonNullable: true });
  readonly consulta = toSignal(
    this.buscar.valueChanges.pipe(
      map(texto => texto.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      scan((anterior, valor) => ({ valor, emisiones: anterior.emisiones + 1 }), { valor: '', emisiones: 0 }),
    ),
    { initialValue: { valor: '', emisiones: 0 } },
  );

  readonly visibles = computed(() => {
    const { valor } = this.consulta();
    const ordenes = this.registro.ordenes();
    return valor ? ordenes.filter(orden => coincide(orden, valor)) : ordenes;
  });
}

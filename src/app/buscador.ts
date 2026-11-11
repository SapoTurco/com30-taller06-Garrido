import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, shareReplay, switchMap } from 'rxjs';
import { EstadoOrden, OrdenMantenimiento } from './models/registro';
import { RegistroService } from './services/registro.service';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="search-panel" aria-labelledby="search-title">
      <div class="orders-heading">
        <div><p class="eyebrow">CONSULTA DE ÓRDENES</p><h2 id="search-title">Busca un trabajo de mantenimiento</h2></div>
        <span class="count-pill">Llamadas: <strong data-testid="llamadas">{{ registro.llamadas() }}</strong></span>
      </div>
      <div class="search-controls">
        <div class="field">
          <label for="busqueda">Buscar órdenes</label>
          <input id="busqueda" type="search" [formControl]="busqueda" placeholder="Ej. motor, bomba o Andrés" autocomplete="off" aria-describedby="search-help search-status" />
          <small id="search-help">Busca por código, tipo, técnico o descripción. Ignora tildes y mayúsculas.</small>
        </div>
        <div class="field">
          <label for="filtro-estado">Filtrar por estado</label>
          <select id="filtro-estado" [value]="filtro()" (change)="cambiarFiltro($event)">
            <option value="Todos">Todos</option>
            @for (estado of estados; track estado) { <option [value]="estado">{{ estado }}</option> }
          </select>
          <small>El filtro no realiza consultas nuevas.</small>
        </div>
      </div>
      <div id="search-status" class="search-status" role="status" aria-live="polite">
        @if (texto().length < 2) { <span>Escribe mínimo 2 caracteres para buscar.</span> }
        @else if (buscando()) { <span>Buscando…</span> }
        @else if (aviso()) { <span>{{ aviso() }}</span> }
        @else { <span>{{ total() }} órdenes mostradas.</span> }
      </div>
      <div class="search-summary" aria-label="Resumen de resultados">
        <span>Total: <strong data-testid="total">{{ total() }}</strong></span>
        @for (estado of estados; track estado) {
          <span>{{ estado }}: <strong>{{ porEstado()[estado] }}</strong></span>
        }
      </div>
      <div class="results-wrap" [attr.aria-busy]="buscando()">
        <table class="results-table">
          <caption>Resultados de búsqueda de órdenes</caption>
          <thead><tr><th>Orden</th><th>Equipo</th><th>Tipo</th><th>Técnico</th><th>Descripción</th><th>Estado</th></tr></thead>
          <tbody>
            @for (orden of visibles(); track orden.id) {
              <tr data-testid="resultado"><td>{{ orden.id }}</td><td>{{ orden.equipo }}</td><td>{{ orden.tipo }}</td><td>{{ orden.tecnico }}</td><td>{{ orden.descripcion }}</td><td>{{ orden.estado }}</td></tr>
            } @empty {
              <tr><td colspan="6" class="search-empty">
                @if (texto().length < 2) { Introduce al menos dos caracteres. }
                @else if (buscando()) { Buscando… }
                @else if (aviso()) { {{ aviso() }} }
                @else { Sin coincidencias }
              </td></tr>
            }
          </tbody>
        </table>
      </div>
      <div class="search-history">
        <h3>Últimas 5 consultas</h3>
        <ol aria-label="Historial de consultas">
          @for (consulta of historial(); track $index) { <li>{{ consulta }}</li> }
          @empty { <li class="history-empty">Aún no has realizado consultas.</li> }
        </ol>
      </div>
    </section>
  `,
})
export class Buscador {
  readonly registro = inject(RegistroService);
  readonly estados: EstadoOrden[] = ['Pendiente', 'En proceso', 'Finalizada'];
  readonly busqueda = new FormControl('', { nonNullable: true });
  readonly filtro = signal<EstadoOrden | 'Todos'>('Todos');
  readonly buscando = signal(false);
  readonly aviso = signal('');
  readonly historial = signal<string[]>([]);
  readonly texto = toSignal(this.busqueda.valueChanges.pipe(map(t => t.trim())), { initialValue: '' });

  // Se comparte el texto procesado, no se duplica la consulta al suscribir el historial.
  private readonly consultas$ = this.busqueda.valueChanges.pipe(
    map(t => t.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly resultados = toSignal(this.consultas$.pipe(
    switchMap(texto => {
      // switchMap cancela y finaliza la anterior antes de encender la nueva.
      this.aviso.set('');
      if (texto.length < 2) {
        this.buscando.set(false);
        return of<OrdenMantenimiento[]>([]);
      }
      this.buscando.set(true);
      return this.registro.buscar(texto).pipe(
        catchError(() => {
          this.aviso.set('No se pudo consultar. Intenta otra búsqueda.');
          return of<OrdenMantenimiento[]>([]);
        }),
        finalize(() => this.buscando.set(false)),
      );
    }),
  ), { initialValue: [] as OrdenMantenimiento[] });

  readonly visibles = computed(() => {
    if (this.texto().length < 2 || this.buscando()) return [];
    // Refleja cambios de estado y eliminaciones hechos en el formulario del T06.
    const ids = new Set(this.resultados().map(orden => orden.id));
    return this.registro.ordenes().filter(orden => ids.has(orden.id)
      && (this.filtro() === 'Todos' || orden.estado === this.filtro()));
  });
  readonly total = computed(() => this.visibles().length);
  readonly porEstado = computed(() => {
    const conteo: Record<EstadoOrden, number> = { Pendiente: 0, 'En proceso': 0, Finalizada: 0 };
    for (const orden of this.visibles()) conteo[orden.estado]++;
    return conteo;
  });

  constructor() {
    this.consultas$.pipe(takeUntilDestroyed()).subscribe(texto => {
      if (texto.length >= 2) this.historial.update(actual => [texto, ...actual].slice(0, 5));
    });
  }

  cambiarFiltro(evento: Event): void {
    this.filtro.set((evento.target as HTMLSelectElement).value as EstadoOrden | 'Todos');
  }
}

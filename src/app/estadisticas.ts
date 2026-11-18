import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistroService } from './services/registro.service';

@Component({
  selector: 'app-estadisticas',
  imports: [RouterLink],
  template: `
    <main class="page-shell stats-page">
      <section class="hero"><div><p class="eyebrow">RESUMEN GENERAL</p><h1>Estadísticas de mantenimiento</h1><p class="hero-copy">Conoce el estado de las órdenes y la carga de trabajo de tus equipos.</p></div></section>
      <section class="stats-grid" aria-label="Indicadores de órdenes">
        <article class="stat-card stat-total"><span>Total de órdenes</span><strong>{{ registro.totalOrdenes() }}</strong><p>Trabajos registrados</p></article>
        @for (fila of resumen(); track fila.estado) {
          <a class="stat-card" routerLink="/ordenes" [queryParams]="{estado: fila.estado}" [class.stat-done]="fila.estado === 'Finalizada'">
            <span>{{ fila.estado }}</span><strong>{{ fila.total }}</strong><p>{{ fila.porcentaje }}% del total <span aria-hidden="true">↗</span></p>
          </a>
        }
      </section>
      <div class="stats-columns">
        <section class="panel chart-panel"><p class="eyebrow">SEGUIMIENTO</p><h2>Distribución por estado</h2>
          @for (fila of resumen(); track fila.estado) {
            <div class="chart-row"><div class="chart-label"><span>{{ fila.estado }}</span><strong>{{ fila.total }} órdenes · {{ fila.porcentaje }}%</strong></div>
              <div class="bar-track" role="meter" [attr.aria-label]="fila.estado" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="fila.porcentaje"><div class="bar-fill" [class.bar-progress]="fila.estado === 'En proceso'" [class.bar-done]="fila.estado === 'Finalizada'" [style.width.%]="fila.porcentaje"></div></div>
            </div>
          }
          @if (!registro.totalOrdenes()) { <p class="stats-note">Todavía no hay órdenes. Registra la primera para ver sus estadísticas.</p> }
        </section>
        <section class="panel chart-panel"><p class="eyebrow">PLANIFICACIÓN</p><h2>Trabajo estimado</h2><div class="hours-total">{{ horas() }} <span>horas</span></div><p class="stats-note">Suma de las horas estimadas de todas las tareas registradas.</p>
          <div class="stat-divider"></div><h3>Órdenes por tipo</h3>
          @for (fila of tipos(); track fila.tipo) { <div class="type-row"><span>{{ fila.tipo }}</span><strong>{{ fila.total }}</strong></div> }
        </section>
      </div>
      <p class="stats-note">Los indicadores se actualizan al crear, cambiar de estado o eliminar órdenes. Los datos se conservan durante esta sesión.</p>
    </main>
  `,
})
export class Estadisticas {
  readonly registro = inject(RegistroService);
  readonly resumen = computed(() => ['Pendiente', 'En proceso', 'Finalizada'].map(estado => {
    const total = this.registro.ordenes().filter(o => o.estado === estado).length;
    return { estado, total, porcentaje: this.registro.totalOrdenes() ? Math.round(total * 100 / this.registro.totalOrdenes()) : 0 };
  }));
  readonly horas = computed(() => this.registro.ordenes().reduce((total, orden) => total + orden.tareas.reduce((suma, tarea) => suma + tarea.horasEstimadas, 0), 0));
  readonly tipos = computed(() => ['Preventivo', 'Correctivo', 'Predictivo'].map(tipo => ({ tipo, total: this.registro.ordenes().filter(o => o.tipo === tipo).length })));
}

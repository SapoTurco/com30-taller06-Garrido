import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EstadoOrden } from './models/registro';
import { RegistroService } from './services/registro.service';
import { Buscador } from './buscador';
import {
  minimoTareas,
  rangoFechas,
  sinSoloEspacios,
} from './validators/validadores';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, Buscador],
  template: `
    <main class="page-shell">
      <section class="hero" id="inicio">
        <div>
          <h1>Órdenes de mantenimiento</h1>
          <p class="hero-copy">Registra trabajos, organiza tareas y mantén cada equipo al día.</p>
        </div>
      </section>

      <app-buscador />

      <div class="content-grid">
        <section class="panel form-panel" aria-labelledby="form-title">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">NUEVO REGISTRO</p>
              <h2 id="form-title">Datos de la orden</h2>
            </div>
            <span class="step-badge">01</span>
          </div>

          <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
            <div class="form-section-label"><span>01</span> Información del equipo</div>
            <div class="field-grid">
              <div class="field">
                <label for="equipo">Código del equipo <b>*</b></label>
                <input id="equipo" type="text" formControlName="equipo" placeholder="EQ-001" />
                @if (mostrarError('equipo', 'required')) { <small class="error">Ingresa el código del equipo.</small> }
                @else if (mostrarError('equipo', 'pattern')) { <small class="error">Usa el formato EQ- seguido de tres dígitos.</small> }
              </div>
              <div class="field">
                <label for="tipo">Tipo de mantenimiento <b>*</b></label>
                <select id="tipo" formControlName="tipo">
                  <option value="" disabled>Selecciona un tipo</option>
                  <option>Preventivo</option><option>Correctivo</option><option>Predictivo</option>
                </select>
                @if (mostrarError('tipo', 'required')) { <small class="error">Selecciona el tipo de mantenimiento.</small> }
              </div>
              <div class="field field-wide">
                <label for="tecnico">Técnico responsable <b>*</b></label>
                <input id="tecnico" type="text" formControlName="tecnico" placeholder="Nombre completo" />
                @if (mostrarError('tecnico', 'required')) { <small class="error">Ingresa el nombre del técnico.</small> }
                @else if (mostrarError('tecnico', 'soloEspacios')) { <small class="error">El nombre no puede contener solo espacios.</small> }
                @else if (mostrarError('tecnico', 'minlength')) { <small class="error">Escribe al menos 5 caracteres.</small> }
              </div>
            </div>

            <div class="form-section-label section-spaced"><span>02</span> Fechas y descripción</div>
            <div class="field-grid">
              <div class="field">
                <label for="fechaInicio">Fecha de inicio <b>*</b></label>
                <input id="fechaInicio" type="date" formControlName="fechaInicio" />
                @if (mostrarError('fechaInicio', 'required')) { <small class="error">Indica la fecha de inicio.</small> }
              </div>
              <div class="field">
                <label for="fechaFin">Fecha de fin <b>*</b></label>
                <input id="fechaFin" type="date" formControlName="fechaFin" />
                @if (mostrarError('fechaFin', 'required')) { <small class="error">Indica la fecha de fin.</small> }
              </div>
              @if (form.hasError('rangoFechas') && (form.touched || form.dirty)) {
                <div class="group-error" role="alert">La fecha de fin debe ser igual o posterior a la fecha de inicio.</div>
              }
              <div class="field field-wide">
                <label for="descripcion">Descripción del trabajo o la falla <b>*</b></label>
                <textarea id="descripcion" rows="3" formControlName="descripcion" placeholder="Describe el trabajo que se realizará"></textarea>
                @if (mostrarError('descripcion', 'required')) { <small class="error">Escribe una descripción.</small> }
                @else if (mostrarError('descripcion', 'minlength')) { <small class="error">La descripción debe tener al menos 10 caracteres.</small> }
              </div>
            </div>

            <div class="form-section-label section-spaced"><span>03</span> Tareas estimadas</div>
            <div formArrayName="tareas" class="task-list">
              @for (tarea of tareas.controls; track $index; let i = $index) {
                <div class="task-row" [formGroupName]="i">
                  <div class="task-index">{{ (i + 1).toString().padStart(2, '0') }}</div>
                  <div class="field task-description">
                    <label [for]="'tarea-' + i">Descripción de la tarea <b>*</b></label>
                    <input [id]="'tarea-' + i" type="text" formControlName="descripcion" placeholder="Ej. Limpieza interna" />
                    @if (errorTarea(i, 'descripcion', 'required')) { <small class="error">Este campo es obligatorio.</small> }
                    @else if (errorTarea(i, 'descripcion', 'minlength')) { <small class="error">Escribe al menos 5 caracteres.</small> }
                  </div>
                  <div class="field task-hours">
                    <label [for]="'horas-' + i">Horas <b>*</b></label>
                    <input [id]="'horas-' + i" type="number" min="1" step="1" formControlName="horasEstimadas" />
                    @if (errorTarea(i, 'horasEstimadas', 'required') || errorTarea(i, 'horasEstimadas', 'min')) { <small class="error">Debe ser al menos 1 hora.</small> }
                  </div>
                  <button class="icon-button remove-button" type="button" (click)="quitarTarea(i)" [attr.aria-label]="'Quitar tarea ' + (i + 1)">×</button>
                </div>
              } @empty {
                <div class="empty-tasks">Aún no hay tareas. Agrega al menos una para registrar la orden.</div>
              }
            </div>
            @if (tareas.hasError('minimoTareas') && (tareas.touched || tareas.dirty)) {
              <small class="error array-error">Agrega al menos una tarea.</small>
            }
            <button class="add-task" type="button" (click)="agregarTarea()"><span>+</span> Agregar tarea</button>

            <div class="form-footer">
              <span class="required-note">* Campos obligatorios</span>
              <button class="primary-button" type="submit" [disabled]="form.invalid">
                Registrar orden <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </section>

        <aside class="side-column">
          <section class="summary-card" #resumenTrigger>
            <p class="eyebrow">RESUMEN</p>
            <h2>Tu jornada</h2>
            <div class="summary-number">{{ registro.totalOrdenes() | number }}</div>
            <p class="summary-caption">órdenes registradas</p>
            <div class="summary-divider"></div>
            <div class="pending-line"><span class="pending-dot"></span><span>Pendientes</span><strong>{{ registro.pendientes() }}</strong></div>
          </section>
          @defer (on interaction(resumenTrigger)) {
            <section class="deferred-card">
              <h3>Estado del tablero</h3>
              <div class="mini-stat"><span>Total de órdenes</span><strong>{{ registro.totalOrdenes() }}</strong></div>
              <div class="mini-stat"><span>Por iniciar</span><strong>{{ registro.pendientes() }}</strong></div>
              <div class="mini-stat"><span>En proceso</span><strong>{{ contarEstado('En proceso') }}</strong></div>
              <div class="mini-stat"><span>Finalizadas</span><strong>{{ contarEstado('Finalizada') }}</strong></div>
            </section>
          }
        </aside>
      </div>

      <section class="orders-section" aria-labelledby="orders-title">
        <div class="orders-heading">
          <div><h2 id="orders-title">Órdenes registradas <span class="count-pill">{{ registro.totalOrdenes() }}</span></h2></div>
          <span class="list-hint">Actualiza el estado desde cada tarjeta</span>
        </div>
        <div class="orders-list">
          @for (orden of registro.ordenes(); track orden.id) {
            <article class="order-card">
              <div class="order-marker" [class.marker-done]="orden.estado === 'Finalizada'">{{ orden.equipo.slice(-3) }}</div>
              <div class="order-main">
                <div class="order-title-line"><h3>{{ orden.equipo }} <span>· {{ orden.tipo }}</span></h3><span class="status-badge" [class.status-progress]="orden.estado === 'En proceso'" [class.status-done]="orden.estado === 'Finalizada'">{{ orden.estado }}</span></div>
                <p class="order-description">{{ orden.descripcion }}</p>
                <div class="order-meta"><span>♙ {{ orden.tecnico }}</span><span>▣ {{ orden.fechaInicio }} – {{ orden.fechaFin }}</span><span>◷ {{ totalHoras(orden.tareas) }} h estimadas</span></div>
                <div class="task-chips">@for (tarea of orden.tareas; track $index) { <span>{{ tarea.descripcion }} · {{ tarea.horasEstimadas }} h</span> }</div>
              </div>
              <div class="order-actions">
                <label class="sr-only" [for]="'estado-' + orden.id">Estado de {{ orden.equipo }}</label>
                <select [id]="'estado-' + orden.id" [value]="orden.estado" (change)="actualizarEstado(orden.id, $event)">
                  <option value="Pendiente">Pendiente</option><option value="En proceso">En proceso</option><option value="Finalizada">Finalizada</option>
                </select>
                <button class="delete-button" type="button" (click)="eliminar(orden.id)">Eliminar</button>
              </div>
            </article>
          } @empty {
            <div class="empty-orders"><div class="empty-illustration">⌁</div><h3>Aún no hay órdenes</h3><p>Completa el formulario para crear tu primera orden de mantenimiento.</p></div>
          }
        </div>
      </section>
    </main>
  `,
})
export class App {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly registro = inject(RegistroService);
  readonly form = this.fb.group(
    {
      equipo: ['', [Validators.required, Validators.pattern(/^EQ-\d{3}$/)]],
      tipo: ['', Validators.required],
      tecnico: ['', [Validators.required, Validators.minLength(5), sinSoloEspacios()]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tareas: this.fb.array<FormGroup>([this.crearTarea()], {
        validators: [minimoTareas(1)],
      }),
    },
    { validators: [rangoFechas] },
  );

  get tareas(): FormArray<FormGroup> {
    return this.form.controls.tareas;
  }

  private crearTarea(): FormGroup {
    return this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      horasEstimadas: [1, [Validators.required, Validators.min(1)]],
    });
  }

  agregarTarea(): void {
    this.tareas.push(this.crearTarea());
  }

  quitarTarea(indice: number): void {
    this.tareas.removeAt(indice);
    this.tareas.markAsDirty();
    this.tareas.markAsTouched();
  }

  mostrarError(control: string, error: string): boolean {
    const campo = this.form.get(control);
    return !!campo?.hasError(error) && !!(campo.touched || campo.dirty);
  }

  errorTarea(indice: number, control: string, error: string): boolean {
    const campo = this.tareas.at(indice)?.get(control);
    return !!campo?.hasError(error) && !!(campo.touched || campo.dirty);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    this.registro.agregar({
      equipo: valor.equipo.trim().toUpperCase(),
      tipo: valor.tipo,
      tecnico: valor.tecnico.trim(),
      fechaInicio: valor.fechaInicio,
      fechaFin: valor.fechaFin,
      descripcion: valor.descripcion.trim(),
      tareas: valor.tareas.map((tarea) => ({
        descripcion: tarea['descripcion'].trim(),
        horasEstimadas: Number(tarea['horasEstimadas']),
      })),
    });
    this.tareas.clear();
    this.form.reset({
      equipo: '', tipo: '', tecnico: '', fechaInicio: '', fechaFin: '',
      descripcion: '', tareas: [],
    });
    this.tareas.push(this.crearTarea());
  }

  actualizarEstado(id: number, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoOrden;
    this.registro.cambiarEstado(id, estado);
  }

  eliminar(id: number): void {
    this.registro.eliminar(id);
  }

  contarEstado(estado: EstadoOrden): number {
    return this.registro.ordenes().filter((orden) => orden.estado === estado).length;
  }

  totalHoras(tareas: { horasEstimadas: number }[]): number {
    return tareas.reduce((total, tarea) => total + tarea.horasEstimadas, 0);
  }
}

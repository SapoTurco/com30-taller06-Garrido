import { Injectable, computed, signal } from '@angular/core';
import { EstadoOrden, OrdenMantenimiento } from '../models/registro';
import { SEMILLA, coincide } from '../models/semilla';
import { Observable, defer, delay, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly _ordenes = signal<OrdenMantenimiento[]>(structuredClone(SEMILLA));
  private readonly _llamadas = signal(0);
  readonly llamadas = this._llamadas.asReadonly();
  readonly ordenes = this._ordenes.asReadonly();
  readonly totalOrdenes = computed(() => this._ordenes().length);
  readonly pendientes = computed(
    () => this._ordenes().filter((orden) => orden.estado === 'Pendiente').length,
  );

  buscar(texto: string): Observable<OrdenMantenimiento[]> {
    const consulta = texto.trim();
    if (consulta.length < 2) return of([]);
    // El contador crece al suscribirse; una petición cancelada también cuenta.
    return defer(() => {
      this._llamadas.update(n => n + 1);
      const resultado = this._ordenes().filter(orden => coincide(orden, consulta));
      const retardo = Math.max(150, 1500 - 300 * consulta.length);
      return of(resultado).pipe(delay(retardo));
    });
  }

  agregar(orden: Omit<OrdenMantenimiento, 'id' | 'estado' | 'creadaEn'>): void {
    const nuevaOrden: OrdenMantenimiento = {
      ...orden,
      id: Date.now() + Math.floor(Math.random() * 1000),
      estado: 'Pendiente',
      creadaEn: new Date().toISOString(),
    };
    this._ordenes.update((actuales) => [nuevaOrden, ...actuales]);
  }

  cambiarEstado(id: number, estado: EstadoOrden): void {
    this._ordenes.update((actuales) =>
      actuales.map((orden) => (orden.id === id ? { ...orden, estado } : orden)),
    );
  }

  eliminar(id: number): void {
    this._ordenes.update((actuales) =>
      actuales.filter((orden) => orden.id !== id),
    );
  }
}

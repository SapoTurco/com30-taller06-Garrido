import { Injectable, computed, signal } from '@angular/core';
import { EstadoOrden, OrdenMantenimiento } from '../models/registro';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly _ordenes = signal<OrdenMantenimiento[]>([]);
  readonly ordenes = this._ordenes.asReadonly();
  readonly totalOrdenes = computed(() => this._ordenes().length);
  readonly pendientes = computed(
    () => this._ordenes().filter((orden) => orden.estado === 'Pendiente').length,
  );

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

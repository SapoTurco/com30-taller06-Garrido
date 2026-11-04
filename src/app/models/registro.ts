export type EstadoOrden = 'Pendiente' | 'En proceso' | 'Finalizada';

export interface TareaMantenimiento {
  descripcion: string;
  horasEstimadas: number;
}

export interface OrdenMantenimiento {
  id: number;
  equipo: string;
  tipo: string;
  tecnico: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  tareas: TareaMantenimiento[];
  estado: EstadoOrden;
  creadaEn: string;
}

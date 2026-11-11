import { EstadoOrden, OrdenMantenimiento } from './registro';

// Datos propios del escenario del Taller 06. IDs estables para las pruebas.
const datos: [string, string, string, EstadoOrden][] = [
  ['Preventivo', 'Andrés Pérez', 'Limpieza del motor principal del torno', 'Pendiente'],
  ['Correctivo', 'Laura Gómez', 'Reparación del motor principal del compresor', 'En proceso'],
  ['Predictivo', 'Carlos Ruiz', 'Inspección del motor principal del extractor', 'Finalizada'],
  ['Preventivo', 'Andrés Pérez', 'Lubricación del motor auxiliar de la banda', 'Pendiente'],
  ['Correctivo', 'Laura Gómez', 'Ajuste del motor de ventilación', 'En proceso'],
  ['Predictivo', 'Carlos Ruiz', 'Medición del motor de la mezcladora', 'Finalizada'],
  ['Preventivo', 'Daniela Ríos', 'Revisión del motor del elevador', 'Pendiente'],
  ['Correctivo', 'Laura Gómez', 'Reparación de bomba y módulo de presión', 'Pendiente'],
  ['Preventivo', 'Daniela Ríos', 'Limpieza de bomba y módulo de control', 'En proceso'],
  ['Predictivo', 'Carlos Ruiz', 'Inspección de bomba hidráulica', 'Finalizada'],
  ['Correctivo', 'Andrés Pérez', 'Cambio del sello de bomba de agua', 'Pendiente'],
  ['Preventivo', 'Daniela Ríos', 'Calibración de válvula de seguridad', 'Finalizada'],
];

export const SEMILLA: OrdenMantenimiento[] = datos.map(([tipo, tecnico, descripcion, estado], i) => ({
  id: i + 1,
  equipo: `EQ-${String(i + 1).padStart(3, '0')}`,
  tipo, tecnico, descripcion, estado,
  fechaInicio: '2026-11-04',
  fechaFin: '2026-11-10',
  creadaEn: '2026-11-04T18:45:00-05:00',
  tareas: [{ descripcion: 'Verificar funcionamiento del equipo', horasEstimadas: i % 3 + 1 }],
}));

export function normalizar(texto: string): string {
  return texto.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

// Coincidencia parcial en cuatro campos declarados, nunca en el estado.
export function coincide(orden: OrdenMantenimiento, texto: string): boolean {
  const consulta = normalizar(texto);
  return [orden.equipo, orden.tipo, orden.tecnico, orden.descripcion]
    .some(campo => normalizar(campo).includes(consulta));
}

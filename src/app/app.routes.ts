import { Routes } from '@angular/router';
import { Listado } from './listado';
import { Detalle } from './detalle';
import { Alta } from './alta';
import { NoEncontrada } from './no-encontrada';
export const routes: Routes = [
  {path: '', redirectTo: 'ordenes', pathMatch: 'full', title: 'Inicio'},
  {path: 'ordenes', component: Listado, title: 'Órdenes de mantenimiento'},
  {path: 'ordenes/nueva', component: Alta, title: 'Nueva orden'},
  {path: 'ordenes/:id', component: Detalle, title: 'Detalle de la orden'},
  {path: 'estadisticas', loadComponent: () => import('./estadisticas').then(m => m.Estadisticas), title: 'Estadísticas'},
  {path: '**', component: NoEncontrada, title: 'Página no encontrada'}
];

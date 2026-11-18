import { Component, computed, inject } from '@angular/core';
import { RegistroService } from './services/registro.service';
@Component({selector:'app-estadisticas',template:`<main class="page-shell"><h1>Estadísticas de mantenimiento</h1><section class="panel detail-panel"><h2>Total de órdenes: {{registro.totalOrdenes()}}</h2><dl>@for(fila of resumen();track fila.estado){<dt>{{fila.estado}}</dt><dd>{{fila.total}}</dd>}</dl></section></main>`})
export class Estadisticas {readonly registro=inject(RegistroService);readonly resumen=computed(()=>['Pendiente','En proceso','Finalizada'].map(estado=>({estado,total:this.registro.ordenes().filter(o=>o.estado===estado).length})));}

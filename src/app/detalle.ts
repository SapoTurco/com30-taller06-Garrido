import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistroService } from './services/registro.service';
@Component({selector:'app-detalle',imports:[RouterLink],template:`<main class="page-shell"><h1>Detalle de la orden</h1>
@if(registro(); as orden){<section class="panel detail-panel"><h2>Orden {{orden.id}} · {{orden.equipo}}</h2><dl><dt>Tipo</dt><dd>{{orden.tipo}}</dd><dt>Técnico responsable</dt><dd>{{orden.tecnico}}</dd><dt>Estado</dt><dd>{{orden.estado}}</dd><dt>Fechas</dt><dd>{{orden.fechaInicio}} a {{orden.fechaFin}}</dd><dt>Descripción</dt><dd>{{orden.descripcion}}</dd></dl><h3>Tareas</h3><ul>@for(tarea of orden.tareas;track $index){<li>{{tarea.descripcion}} · {{tarea.horasEstimadas}} h</li>}</ul></section>}
@else{<section class="empty-orders"><h2>No existe la orden {{id()}}</h2><p>Comprueba el código de la orden.</p></section>}
<p><a routerLink="/ordenes">Volver a las órdenes</a></p></main>`})
export class Detalle {readonly id=input.required<string>();private readonly servicio=inject(RegistroService);readonly registro=computed(()=>this.servicio.ordenes().find(o=>String(o.id)===this.id()));}

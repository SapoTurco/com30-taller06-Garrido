import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegistroService } from './services/registro.service';
import { EstadoOrden } from './models/registro';
import { Buscador } from './buscador';
@Component({selector:'app-listado', imports:[RouterLink, Buscador], template:`
<main class="page-shell"><section class="hero"><div><h1>Órdenes de mantenimiento</h1><p>Organiza el mantenimiento de tus equipos.</p></div></section>
<nav class="filters" aria-label="Filtrar por estado">
<a routerLink="/ordenes" [class.active]="!estado()">Todas</a>
@for (opcion of estados; track opcion) {<a routerLink="/ordenes" [queryParams]="{estado:opcion}" [class.active]="estado() === opcion">{{opcion}}</a>}
</nav><h2>Órdenes registradas <span class="count-pill">{{visibles().length}}</span></h2>
<div class="orders-list">@for (orden of visibles(); track orden.id) {
<article class="order-card"><div class="order-marker">{{orden.id}}</div><div class="order-main">
<h3><a [routerLink]="['/ordenes',orden.id]">Orden {{orden.id}} · {{orden.equipo}}</a></h3><p>{{orden.tipo}} · {{orden.tecnico}}</p><p>{{orden.descripcion}}</p><span class="status-badge">{{orden.estado}}</span></div>
<div class="order-actions"><label [for]="'estado-'+orden.id">Estado</label><select [id]="'estado-'+orden.id" [value]="orden.estado" (change)="cambiar(orden.id,$event)">@for (opcion of estados;track opcion){<option [value]="opcion">{{opcion}}</option>}</select><button type="button" class="delete-button" (click)="registro.eliminar(orden.id)">Eliminar</button></div></article>
} @empty {<div class="empty-orders"><h3>No hay órdenes con ese estado</h3><p>Estado solicitado: {{estado() || 'Todos'}}.</p></div>}</div>
<app-buscador /></main>`})
export class Listado {
readonly registro=inject(RegistroService);
readonly estado=input<string>();
readonly estados:EstadoOrden[]=['Pendiente','En proceso','Finalizada'];
readonly visibles=computed(()=>this.registro.ordenes().filter(o=>!this.estado() || o.estado===this.estado()));
cambiar(id:number,event:Event):void {this.registro.cambiarEstado(id,(event.target as HTMLSelectElement).value as EstadoOrden);}
}

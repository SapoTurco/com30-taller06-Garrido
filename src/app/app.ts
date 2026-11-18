import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({selector: 'app-root', imports: [RouterLink, RouterLinkActive, RouterOutlet], template: `
  <header class="page-shell"><nav class="topbar" aria-label="Navegación principal">
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a>
    <a routerLink="/ordenes" routerLinkActive="active">Órdenes</a>
    <a routerLink="/ordenes/nueva" routerLinkActive="active">Nueva orden</a>
    <a routerLink="/estadisticas" routerLinkActive="active">Estadísticas</a>
  </nav></header><router-outlet />`})
export class App {}

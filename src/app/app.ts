import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({selector: 'app-root', imports: [RouterLink, RouterLinkActive, RouterOutlet], template: `
  <header class="site-header"><div class="page-shell header-inner">
    <a class="brand" routerLink="/" routerLinkActive="brand-active" [routerLinkActiveOptions]="{exact:true}" aria-label="Ir al inicio de mantenimiento"><span class="brand-mark">M</span><span>Mantenimiento<span class="brand-sub">GESTIÓN DE ÓRDENES</span></span></a>
    <nav class="topbar" aria-label="Navegación principal">
      <a routerLink="/ordenes" routerLinkActive #listadoActivo="routerLinkActive" [class.active]="listadoActivo.isActive && !router.url.startsWith('/ordenes/nueva')" [attr.aria-current]="listadoActivo.isActive && !router.url.startsWith('/ordenes/nueva') ? 'page' : null">Órdenes</a>
      <a routerLink="/ordenes/nueva" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" ariaCurrentWhenActive="page">Nueva orden</a>
      <a routerLink="/estadisticas" routerLinkActive="active" ariaCurrentWhenActive="page">Estadísticas</a>
    </nav>
  </div></header><router-outlet />`})
export class App { readonly router = inject(Router); }

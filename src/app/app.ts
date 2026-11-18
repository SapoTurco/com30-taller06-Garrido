import { Component, computed, inject } from '@angular/core';
import { isActive, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({selector: 'app-root', imports: [RouterLink, RouterLinkActive, RouterOutlet], template: `
  <header class="site-header"><div class="page-shell header-inner">
    <a class="brand" routerLink="/" routerLinkActive="brand-active" [routerLinkActiveOptions]="{exact:true}" aria-label="Ir al inicio de mantenimiento"><span class="brand-mark">M</span><span>Mantenimiento<span class="brand-sub">GESTIÓN DE ÓRDENES</span></span></a>
    <nav class="topbar" aria-label="Navegación principal">
      <a routerLink="/ordenes" [class.active]="ordenesActivas()" [attr.aria-current]="ordenesActivas() ? 'page' : null">Órdenes</a>
      <a routerLink="/ordenes/nueva" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" ariaCurrentWhenActive="page">Nueva orden</a>
      <a routerLink="/estadisticas" routerLinkActive="active" ariaCurrentWhenActive="page">Estadísticas</a>
    </nav>
  </div></header><router-outlet />`})
export class App {
  private readonly router = inject(Router);
  private readonly rutaOrdenes = isActive('/ordenes', this.router, {
    paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored',
  });
  private readonly rutaAlta = isActive('/ordenes/nueva', this.router, {
    paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored',
  });
  readonly ordenesActivas = computed(() => this.rutaOrdenes() && !this.rutaAlta());
}

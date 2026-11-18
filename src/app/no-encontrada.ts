import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({selector:'app-no-encontrada',imports:[RouterLink],template:`<main class="page-shell"><h1>404 · Página no encontrada</h1><p>No existe la dirección {{router.url}}</p><a routerLink="/ordenes">Volver a las órdenes</a></main>`})
export class NoEncontrada {readonly router=inject(Router);}

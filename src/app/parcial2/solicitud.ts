import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusquedaOrdenes } from './busqueda-ordenes';
import { M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayor, multiploDe } from './validadores';

const numero = Validators.pattern(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/);

@Component({
  selector: 'app-solicitud',
  imports: [ReactiveFormsModule, BusquedaOrdenes],
  templateUrl: './solicitud.html',
})
export class Solicitud {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  readonly m = M;
  readonly tope = TOPE;
  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(PATRON_CODIGO)]],
    cantidad: ['', [Validators.required, numero, Validators.min(1), Validators.max(TOPE), multiploDe(M)]],
    desde: ['', [Validators.required, numero]],
    hasta: ['', [Validators.required, numero]],
  }, { validators: hastaMayor });

  mostrarErrores(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.touched || control.dirty;
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { codigo, cantidad } = this.form.getRawValue();
    void this.router.navigate(['/parcial2', 'detalle', codigo], {
      queryParams: { cantidad: Number(cantidad) },
    });
  }
}

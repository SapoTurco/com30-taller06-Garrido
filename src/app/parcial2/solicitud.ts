import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusquedaOrdenes } from './busqueda-ordenes';
import { hastaMayor, multiploDe } from './validadores';

const M = 4;
const TOPE = 24;
const numero = Validators.pattern(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/);

@Component({
  selector: 'app-solicitud',
  imports: [ReactiveFormsModule, BusquedaOrdenes],
  templateUrl: './solicitud.html',
})
export class Solicitud {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly m = M;
  readonly tope = TOPE;
  readonly confirmada = signal(false);
  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{3}$/)]],
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

    this.confirmada.set(true);
  }
}

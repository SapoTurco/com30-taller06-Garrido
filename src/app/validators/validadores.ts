import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
  
  export function sinSoloEspacios(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      typeof control.value === 'string' &&
      control.value !== '' &&
      control.value.trim() === ''
        ? { soloEspacios: true }
        : null;
  }
  
  export const rangoFechas: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const inicio = group.get('fechaInicio')?.value as string | null;
    const fin = group.get('fechaFin')?.value as string | null;
  
    if (!inicio || !fin) return null;
    return fin < inicio ? { rangoFechas: true } : null;
  };
  
  export function minimoTareas(minimo = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      Array.isArray(control.value) && control.value.length < minimo
        ? { minimoTareas: { minimo, actual: control.value.length } }
        : null;
  }
  
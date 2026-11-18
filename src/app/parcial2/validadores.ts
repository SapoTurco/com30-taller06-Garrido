import { ValidatorFn } from '@angular/forms';

export function multiploDe(m: number): ValidatorFn {
  return (control) => {
    const valor = Number(control.value);
    if (!Number.isFinite(valor)) return null;

    return valor % m === 0 ? null : { multiplo: true };
  };
}

export const hastaMayor: ValidatorFn = (grupo) => {
  const desde = grupo.get('desde');
  const hasta = grupo.get('hasta');
  if (!desde?.valid || !hasta?.valid) return null;

  return Number(hasta.value) > Number(desde.value) ? null : { hastaMayor: true };
};

/* eslint-disable no-useless-escape */
import {AbstractControl} from '@angular/forms';
import {n_from, s_from} from 'dfts-helper';

export const allowedCharacterSet = /^[a-zA-Z0-9"'`´#~!?$€&%()={}\[\]_/*+-.,> <\-|°^\\:;ßäöüÄÖÜ\n\r]+$/;

export function passwordMatchValidator(control: AbstractControl): {mismatch: true} | null {
  const password = control.get('newPassword')?.value as string | null;
  const confirmPassword = control.get('confirmPassword')?.value as string | null;

  return !!password && !!confirmPassword && password === confirmPassword ? null : {mismatch: true};
}

export function s_toCurrencyNumber(it: string | undefined | null): number {
  const match: string[] = s_from(it).split(/[,.]/);
  const euro = n_from(match[0] ?? 0);
  const cent = n_from(match[1]?.padEnd(2, '0') ?? 0);

  return euro * 100 + cent;
}

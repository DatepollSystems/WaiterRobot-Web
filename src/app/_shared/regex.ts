/* eslint-disable no-useless-escape */
import {AbstractControl} from '@angular/forms';

export const allowedCharacterSet = /^[a-zA-Z0-9"'`´#~!?$€&%()=\[\]{}_\\/*+\-.,> <|°^:;ßäöüÄÖÜ\n\r]+$/;

export function passwordMatchValidator(control: AbstractControl): {mismatch: true} | null {
  const password = control.get('newPassword')?.value as string | null;
  const confirmPassword = control.get('confirmPassword')?.value as string | null;

  return !!password && !!confirmPassword && password === confirmPassword ? null : {mismatch: true};
}

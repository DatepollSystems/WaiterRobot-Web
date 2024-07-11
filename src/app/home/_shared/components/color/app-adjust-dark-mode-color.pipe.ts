import {Pipe, PipeTransform} from '@angular/core';
import tinycolor from 'tinycolor2';
import {Theme} from '@shared/services/theme.service';

@Pipe({
  name: 'adjustDarkModeColor',
  standalone: true,
  pure: true,
})
export class AppAdjustDarkModeColor implements PipeTransform {
  transform(color: string | null | undefined, theme: Theme['id']): string | null | undefined {
    if (!color || theme !== 'dark') {
      return color;
    }

    const hslColor = tinycolor(color).toHsl();

    return tinycolor
      .fromRatio({
        h: hslColor.h,
        s: hslColor.s * 0.6,
        l: hslColor.l,
        a: hslColor.a,
      })
      .toHexString();
  }
}

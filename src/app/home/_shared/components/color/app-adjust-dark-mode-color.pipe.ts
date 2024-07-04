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
    return color && theme === 'dark' ? tinycolor(color).desaturate(60).toHexString() : color;
  }
}

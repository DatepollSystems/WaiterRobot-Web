import {Pipe, PipeTransform} from '@angular/core';
import tinycolor from 'tinycolor2';

@Pipe({
  name: 'isLightColor',
  standalone: true,
  pure: true,
})
export class AppIsLightColorPipe implements PipeTransform {
  transform(color: string | undefined | null): boolean {
    return color ? tinycolor(color).isLight() : false;
  }
}

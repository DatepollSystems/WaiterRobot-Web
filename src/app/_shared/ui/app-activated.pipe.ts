import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'activated',
  standalone: true,
  pure: true,
})
export class AppActivatedPipe implements PipeTransform {
  transform(activated: boolean): string {
    return activated ? '✅' : '⛔';
  }
}

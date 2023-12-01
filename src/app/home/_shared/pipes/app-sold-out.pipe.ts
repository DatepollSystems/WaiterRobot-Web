import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'soldOut',
  standalone: true,
  pure: true,
})
export class AppSoldOutPipe implements PipeTransform {
  transform(soldOut: boolean): string {
    return soldOut ? '⛔' : '✅';
  }
}

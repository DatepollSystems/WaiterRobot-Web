import {Pipe, PipeTransform} from '@angular/core';
import {IHasName} from 'dfts-helper';

@Pipe({
  name: 'nameMap',
  standalone: true,
  pure: true,
})
export class NameMapPipe implements PipeTransform {
  transform(it: IHasName): string;
  transform(it: IHasName[]): string[];

  transform(it: IHasName | IHasName[]): string | string[] {
    if (Array.isArray(it)) {
      return it.map((it) => it.name);
    }
    return it.name;
  }
}

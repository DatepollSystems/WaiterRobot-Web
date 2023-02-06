import {Pipe, PipeTransform} from '@angular/core';
import {IHasName, UndefinedOrNullOr} from 'dfts-helper';

@Pipe({
  name: 'a_mapName',
  standalone: true,
  pure: true,
})
export class ArrayMapNamePipePipe implements PipeTransform {
  transform(it: UndefinedOrNullOr<IHasName[]>): string[] | undefined {
    return it?.map((it) => it.name);
  }
}

@Pipe({
  name: 'mapName',
  standalone: true,
  pure: true,
})
export class MapNamePipe implements PipeTransform {
  transform(it: UndefinedOrNullOr<IHasName>): string {
    return it?.name ?? '';
  }
}

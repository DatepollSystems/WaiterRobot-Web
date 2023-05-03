import {IHasID} from 'dfts-helper';
import {HasGetAll, HasGetSelected} from 'dfx-helper';
import {map, Observable, switchMap} from 'rxjs';

export function getOrderBySelected<T extends IHasID<string | number>>(service: HasGetSelected<T> & HasGetAll<T>): Observable<T[]> {
  return service.getSelected$.pipe(
    switchMap((selected) =>
      service.getAll$().pipe(
        map((entities) => {
          if (!selected) {
            return entities;
          }
          const arr = entities.filter(({id}) => selected?.id !== id);
          const found = entities.find(({id}) => selected?.id === id);
          if (found) {
            return [found].concat(arr);
          }
          return arr;
        })
      )
    )
  );
}

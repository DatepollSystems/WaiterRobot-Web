import {IHasID} from 'dfts-helper';
import {HasGetAll} from 'dfx-helper';
import {map, Observable, switchMap} from 'rxjs';

export function getOrderBySelected<T extends IHasID<string | number>>(
  selectedService: {selectedNotNull$: Observable<T>},
  service: HasGetAll<T>,
): Observable<T[]> {
  return selectedService.selectedNotNull$.pipe(
    switchMap((selected) =>
      service.getAll$().pipe(
        map((entities) => {
          const arr = entities.filter(({id}) => selected.id !== id);
          const found = entities.find(({id}) => selected.id === id);
          if (found) {
            return [found].concat(arr);
          }
          return arr;
        }),
      ),
    ),
  );
}

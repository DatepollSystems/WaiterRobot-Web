import {IEntityWithNumberID} from 'dfts-helper';
import {map, Observable, switchMap} from 'rxjs';
import {AbstractSelectableModelService} from './abstract-model.service';

export function getOrderBySelected<T extends IEntityWithNumberID>(service: AbstractSelectableModelService<T>): Observable<T[]> {
  return service.getSelected$.pipe(
    switchMap((selected) =>
      service.getAll$().pipe(
        map((events) => {
          const arr = events.filter(({id}) => selected?.id !== id);
          const found = events.find(({id}) => selected?.id === id);
          if (found) {
            return [found].concat(arr);
          }
          return arr;
        })
      )
    )
  );
}

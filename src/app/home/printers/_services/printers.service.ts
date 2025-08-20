import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, combineLatest, map, switchMap, tap} from 'rxjs';

import {APIType, PageableDto, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/custom-types';
import {SelectedEventService} from '@shared/services/selected-event.service';

@Injectable({
  providedIn: 'root',
})
export class PrintersService
  implements HasCreateWithIdResponse<APIType['CreatePrinterDto']>, HasUpdateWithIdResponse<APIType['UpdatePrinterDto']>
{
  #api = injectAPI();
  #selectedEventService = inject(SelectedEventService);

  triggerGet$ = new BehaviorSubject(true);

  getAll$() {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/printer', {
          params: {
            query: {
              eventId,
            },
          },
        }),
      ),
      map((it) => {
        it = it.map((ps) => {
          ps.fontScale = ps.fontScale / 10;
          return ps;
        });
        return it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
      }),
    );
  }

  getAllFonts$() {
    return this.#api.get('/v1/config/printer/fonts');
  }

  getSingle$(id: number) {
    return this.#api
      .get('/v1/config/printer/{id}', {
        params: {
          path: {id},
        },
      })
      .pipe(
        map((it) => {
          it.fontScale = it.fontScale / 10;
          return it;
        }),
      );
  }

  create$(body: APIType['CreatePrinterDto']) {
    return this.#api
      .post('/v1/config/printer', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: APIType['UpdatePrinterDto']) {
    return this.#api.put('/v1/config/printer', {body}).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/printer/{id}', {
        params: {
          path: {id},
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  unDelete$(id: number) {
    return this.#api.delete('/v1/config/printer/{id}/undo', {
      params: {
        path: {id},
      },
    });
  }

  getAllDeleted$(options: PageableDto) {
    return combineLatest([this.#selectedEventService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([eventId]) =>
        this.#api.get('/v1/config/printer/deleted', {
          params: {
            query: {
              eventId,
              ...options,
            },
          },
        }),
      ),
    );
  }
}

import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, EMPTY, catchError, combineLatest, map, shareReplay, switchMap, tap} from 'rxjs';

import {HasGetSingle} from 'dfx-helper';

import {BackendType, injectAPI} from '@shared/api';
import {SelectedOrganisationService} from '@shared/services/selected-organisation.service';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsService
  implements
    HasGetSingle<BackendType['GetEventOrLocationResponse']>,
    HasCreateWithIdResponse<BackendType['CreateEventOrLocationDto']>,
    HasUpdateWithIdResponse<BackendType['UpdateEventOrLocationDto']>
{
  #api = injectAPI();
  #selectedOrganisationService = inject(SelectedOrganisationService);

  create$(body: BackendType['CreateEventOrLocationDto']) {
    return this.#api
      .post('/v1/config/event', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: BackendType['UpdateEventOrLocationDto']) {
    return this.#api
      .put('/v1/config/event', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  delete$(id: number) {
    return this.#api
      .delete('/v1/config/event/{id}', {
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

  triggerGet$ = new BehaviorSubject(true);

  getAll$() {
    return combineLatest([this.#selectedOrganisationService.selectedIdNotNull$, this.triggerGet$]).pipe(
      switchMap(([organisationId]) =>
        this.#api.get('/v1/config/event', {
          params: {
            query: {organisationId},
          },
        }),
      ),
      map((it) => it.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()))),
      shareReplay(1),
      catchError(() => EMPTY),
    );
  }

  getAllById$(organisationId: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/event', {
          params: {
            query: {organisationId},
          },
        }),
      ),
    );
  }

  getSingle$(id: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/event/{id}', {
          params: {
            path: {id},
          },
        }),
      ),
    );
  }

  clone$(eventId: number) {
    return this.#api
      .put('/v1/config/event/{eventId}/clone', {
        params: {
          path: {eventId},
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}

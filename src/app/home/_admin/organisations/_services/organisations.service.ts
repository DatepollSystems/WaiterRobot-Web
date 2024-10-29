import {Injectable} from '@angular/core';

import {BehaviorSubject, EMPTY, catchError, shareReplay, switchMap, tap} from 'rxjs';

import {HasGetSingle} from 'dfx-helper';

import {BackendType, injectAPI} from '@shared/api';
import {HasCreateWithIdResponse, HasUpdateWithIdResponse} from '@shared/services/services.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService
  implements
    HasGetSingle<BackendType['GetOrganisationResponse']>,
    HasCreateWithIdResponse<BackendType['CreateOrganisationDto']>,
    HasUpdateWithIdResponse<BackendType['UpdateOrganisationDto']>
{
  #api = injectAPI();

  create$(body: BackendType['CreateOrganisationDto']) {
    return this.#api
      .post('/v1/config/organisation', {
        body,
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  update$(body: BackendType['UpdateOrganisationDto']) {
    return this.#api
      .put('/v1/config/organisation', {
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
      .delete('/v1/config/organisation/{id}', {
        params: {
          path: {
            id,
          },
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
    return this.triggerGet$.pipe(
      switchMap(() => this.#api.get('/v1/config/organisation')),
      shareReplay(1),
      catchError(() => EMPTY),
    );
  }

  getSingle$(id: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/organisation/{id}', {
          params: {
            path: {
              id,
            },
          },
        }),
      ),
    );
  }
}

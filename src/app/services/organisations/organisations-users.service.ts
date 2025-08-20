import {Injectable, inject} from '@angular/core';

import {BehaviorSubject, Observable, catchError, concat, map, of, switchMap, tap} from 'rxjs';

import {TranslocoService} from '@jsverse/transloco';
import {createInjectable} from 'ngxtension/create-injectable';
import {signalSlice} from 'ngxtension/signal-slice';

import {APIType, injectAPI} from '../../api';
import {NotificationService} from '../notification.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService {
  #api = injectAPI();

  triggerGet$ = new BehaviorSubject(true);

  getByOrganisationId$(organisationId: number) {
    return this.triggerGet$.pipe(
      switchMap(() =>
        this.#api.get('/v1/config/organisation/users', {
          params: {
            query: {organisationId},
          },
        }),
      ),
    );
  }

  delete$(id: number, uEmail: string) {
    return this.#api
      .delete('/v1/config/organisation/{id}/user/{uEmail}', {
        params: {
          path: {
            id,
            uEmail,
          },
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }

  create$(id: number, uEmail: string, body: APIType['OrganisationUserDto']) {
    return this.#api
      .put('/v1/config/organisation/{id}/user/{uEmail}', {
        body,
        params: {
          path: {
            id,
            uEmail,
          },
        },
      })
      .pipe(
        tap(() => {
          this.triggerGet$.next(true);
        }),
      );
  }
}

interface OrganisationUsersState {
  loading: boolean;
  organisationId: number | undefined;
  data: APIType['OrganisationUserResponse'][] | undefined;
}

export const OrganisationUsersService = createInjectable(() => {
  const api = injectAPI();
  const translocoService = inject(TranslocoService);
  const notificationService = inject(NotificationService);

  const initialState: OrganisationUsersState = {
    loading: true,
    organisationId: undefined,
    data: undefined,
  };

  const load = (organisationId: number) =>
    api
      .get('/v1/config/organisation/users', {
        params: {
          query: {organisationId},
        },
      })
      .pipe(map((data) => ({organisationId, data, loading: false})));

  return signalSlice({
    initialState,
    actionSources: {
      load: (state, $: Observable<number | undefined>) =>
        $.pipe(switchMap((organisationId) => concat(of({loading: true}), load(organisationId ?? state().organisationId!)))),
      create: (state, $: Observable<APIType['OrganisationUserDto'] & {email: string}>) =>
        $.pipe(
          switchMap((body) =>
            concat(
              of({loading: true}),
              api
                .put('/v1/config/organisation/{id}/user/{uEmail}', {
                  body,
                  params: {
                    path: {
                      id: state().organisationId!!,
                      uEmail: body.email,
                    },
                  },
                })
                .pipe(
                  catchError(() => {
                    translocoService.selectTranslate<string>('HOME_ORGS_USERS_USER_NOT_FOUND').subscribe((translation) => {
                      notificationService.warning(body.email + translation);
                    });

                    return of({});
                  }),
                  map(() => ({})),
                ),
              load(state().organisationId!),
            ),
          ),
        ),
      delete: (state, $: Observable<string>) =>
        $.pipe(
          switchMap((uEmail) =>
            concat(
              of({loading: true}),
              api
                .delete('/v1/config/organisation/{id}/user/{uEmail}', {
                  params: {
                    path: {
                      id: state().organisationId!!,
                      uEmail,
                    },
                  },
                })
                .pipe(map(() => ({}))),
              load(state().organisationId!),
            ),
          ),
        ),
    },
  });
});

import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {NotificationService} from '@shared/notifications/notification.service';

import {IdResponse, OrganisationUserDto, OrganisationUserResponse} from '@shared/waiterrobot-backend';
import {createInjectable} from 'ngxtension/create-injectable';
import {signalSlice} from 'ngxtension/signal-slice';

import {BehaviorSubject, catchError, concat, map, Observable, of, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganisationsUsersService {
  #url = '/config/organisation/users';

  #httpClient = inject(HttpClient);

  triggerGet$ = new BehaviorSubject(true);

  getByOrganisationId$(organisationId: number): Observable<OrganisationUserResponse[]> {
    return this.triggerGet$.pipe(switchMap(() => this.#httpClient.get<OrganisationUserResponse[]>(this.#url, {params: {organisationId}})));
  }

  delete$(organisationId: number, uEmail: string): Observable<unknown> {
    return this.#httpClient.delete(`/config/organisation/${organisationId}/user/${uEmail}`).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }

  create$(organisationId: number, uEmail: string, dto: OrganisationUserDto): Observable<unknown> {
    return this.#httpClient.put(`/config/organisation/${organisationId}/user/${uEmail}`, dto).pipe(
      tap(() => {
        this.triggerGet$.next(true);
      }),
    );
  }
}

interface OrganisationUsersState {
  loading: boolean;
  organisationId: number | undefined;
  data: OrganisationUserResponse[] | undefined;
}

const url = '/config/organisation/users';

export const OrganisationUsersService = createInjectable(() => {
  const httpClient = inject(HttpClient);
  const translocoService = inject(TranslocoService);
  const notificationService = inject(NotificationService);

  const initialState: OrganisationUsersState = {
    loading: true,
    organisationId: undefined,
    data: undefined,
  };

  const load = (organisationId: number) =>
    httpClient
      .get<OrganisationUserResponse[]>(url, {params: {organisationId}})
      .pipe(map((data) => ({organisationId, data, loading: false})));

  return signalSlice({
    initialState,
    actionSources: {
      load: (state, $: Observable<number | undefined>) =>
        $.pipe(switchMap((organisationId) => concat(of({loading: true}), load(organisationId ?? state().organisationId!)))),
      create: (state, $: Observable<OrganisationUserDto & {email: string}>) =>
        $.pipe(
          switchMap((dto) =>
            concat(
              of({loading: true}),
              httpClient.put<IdResponse>(`/config/organisation/${state().organisationId}/user/${dto.email}`, dto).pipe(
                catchError(() => {
                  translocoService.selectTranslate<string>('HOME_ORGS_USERS_USER_NOT_FOUND').subscribe((translation) => {
                    notificationService.warning(dto.email + translation);
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
          switchMap((email) =>
            concat(
              of({loading: true}),
              httpClient.delete(`/config/organisation/${state().organisationId}/user/${email}`).pipe(map(() => ({}))),
              load(state().organisationId!),
            ),
          ),
        ),
    },
  });
});

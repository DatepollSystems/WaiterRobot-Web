import {Injectable} from '@angular/core';

import {Observable, combineLatest, map, of, startWith, switchMap} from 'rxjs';

import {signalSlice} from 'ngxtension/signal-slice';

import {APIType, injectAPI} from '@shared/api';

type OrganisationsSettingsState = {
  organisationId: number | undefined;
  state: 'LOADING' | 'SETTING' | 'DONE';
  settings: APIType['OrganisationSettingsResponse'] | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationsSettingsService {
  #api = injectAPI();

  #getSettings$(organisationId: number) {
    return this.#api
      .get('/v1/config/organisation/settings', {
        params: {
          query: {
            organisationId,
          },
        },
      })
      .pipe(
        map((it) => {
          it.availableTimezones = it.availableTimezones.sort((a, b) => a.trim().toLowerCase().localeCompare(b.trim().toLowerCase()));
          return it;
        }),
      );
  }

  #set(organisationId: number, key: string, value: boolean | number | string): Observable<Partial<OrganisationsSettingsState>> {
    return this.#api
      .put(
        // @ts-ignore
        `/config/organisation/${organisationId}/setting/${key}`,
        {
          body: {
            value,
          },
        },
      )
      .pipe(
        map((settings) => ({state: 'DONE' as const, settings})),
        startWith({state: 'SETTING' as const}),
      );
  }

  #initialState: OrganisationsSettingsState = {
    organisationId: undefined,
    state: 'LOADING',
    settings: undefined,
  };

  state = signalSlice({
    initialState: this.#initialState,
    actionSources: {
      load: (_state, $: Observable<number>) =>
        $.pipe(
          switchMap((organisationId) => combineLatest([this.#getSettings$(organisationId), of(organisationId)])),
          map(([settings, organisationId]) => ({
            state: 'DONE',
            settings,
            organisationId,
          })),
        ),
      setActivateWaiterOnLoginViaCreateToken: (_state, $: Observable<boolean>) =>
        $.pipe(switchMap((value) => this.#set(_state().organisationId!, 'activateWaiterOnLoginViaCreateToken', value))),
      setTimeZone: (_state, $: Observable<string>) => $.pipe(switchMap((value) => this.#set(_state().organisationId!, 'timezone', value))),
      setStripeEnabled: (_state, $: Observable<boolean>) =>
        $.pipe(switchMap((value) => this.#set(_state().organisationId!, 'stripeEnabled', value))),
      setStripeMinAmount: (_state, $: Observable<number>) =>
        $.pipe(switchMap((value) => this.#set(_state().organisationId!, 'stripeMinAmount', value))),
    },
  });
}

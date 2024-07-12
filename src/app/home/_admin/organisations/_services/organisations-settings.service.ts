import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {OrganisationSettingsResponse} from '@shared/waiterrobot-backend';
import {signalSlice} from 'ngxtension/signal-slice';

import {combineLatest, map, Observable, of, startWith, switchMap} from 'rxjs';

type OrganisationsSettingsState = {
  organisationId: number | undefined;
  state: 'LOADING' | 'SETTING' | 'DONE';
  settings: OrganisationSettingsResponse | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationsSettingsService {
  #httpService = inject(HttpClient);

  #getSettings$(organisationId: number): Observable<OrganisationSettingsResponse> {
    return this.#httpService
      .get<OrganisationSettingsResponse>('/config/organisation/settings', {
        params: {organisationId},
      })
      .pipe(
        map((it) => {
          it.availableTimezones = it.availableTimezones.sort((a, b) => a.trim().toLowerCase().localeCompare(b.trim().toLowerCase()));
          return it;
        }),
      );
  }

  #set(organisationId: number, key: string, value: boolean | number | string): Observable<Partial<OrganisationsSettingsState>> {
    return this.#httpService.put<OrganisationSettingsResponse>(`/config/organisation/${organisationId}/setting/${key}`, {value}).pipe(
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
          map(([settings, organisationId]) => ({state: 'DONE', settings, organisationId})),
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

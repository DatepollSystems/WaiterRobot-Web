import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';

import {catchError, concat, map, Observable, of, switchMap, tap} from 'rxjs';

import {
  AlphabeticIdResponse,
  CreateStripeAccountDto,
  GetStripeAccountMaxResponse,
  GetStripeAccountResponse,
  UpdateStripeAccountDto,
} from '@shared/waiterrobot-backend';
import {signalSlice} from 'ngxtension/signal-slice';
import {NotificationService} from '@shared/notifications/notification.service';

import {injectWindow} from 'dfx-helper';

type OrganisationStripeState = {
  loading: boolean;
  organisationId: number | undefined;
  data: GetStripeAccountResponse[] | undefined;
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationsStripeService {
  #url = '/config/stripe/account';

  #httpClient = inject(HttpClient);
  #window = injectWindow();
  #notificationService = inject(NotificationService);

  #initialState: OrganisationStripeState = {
    loading: true,
    organisationId: undefined,
    data: undefined,
  };

  #load$(organisationId: number) {
    return this.#httpClient
      .get<GetStripeAccountResponse[]>(this.#url, {params: {organisationId}})
      .pipe(map((data) => ({organisationId, data, loading: false})));
  }

  #create$(dto: CreateStripeAccountDto) {
    return this.#httpClient.post<AlphabeticIdResponse>(this.#url, dto).pipe(
      switchMap(({id}) => this.openLink$(id)),
      map(() => ({})),
    );
  }

  #update$(dto: UpdateStripeAccountDto) {
    return this.#httpClient.put<AlphabeticIdResponse>(this.#url, dto).pipe(map(() => ({})));
  }

  #delete$(id: string) {
    return this.#httpClient.delete(`${this.#url}/${id}`).pipe(
      map(() => ({})),
      catchError(() => {
        this.#notificationService.terror('STRIPE_ACCOUNT_BALANCE_NOT_EMPTY');
        return of({});
      }),
    );
  }

  state = signalSlice({
    initialState: this.#initialState,
    actionSources: {
      load: (state, $: Observable<number | undefined>) =>
        $.pipe(switchMap((organisationId) => concat(of({loading: true}), this.#load$(organisationId ?? state().organisationId!)))),
      create: (state, action$: Observable<CreateStripeAccountDto>) =>
        action$.pipe(switchMap((dto) => concat(of({loading: true}), this.#create$(dto), this.#load$(state().organisationId!)))),
      update: (state, action$: Observable<UpdateStripeAccountDto>) =>
        action$.pipe(switchMap((dto) => concat(of({loading: true}), this.#update$(dto), this.#load$(state().organisationId!)))),
      delete: (state, action$: Observable<string>) =>
        action$.pipe(
          switchMap((id) =>
            concat(
              of({loading: true, data: state().data?.filter((it) => it.id !== id)}),
              this.#delete$(id),
              this.#load$(state().organisationId!),
            ),
          ),
        ),
    },
  });

  openLink$(id: string) {
    return this.#httpClient.get<GetStripeAccountMaxResponse>(`/config/stripe/account/${id}`).pipe(
      tap((it) => {
        if (it.state === 'ACTIVE') {
          this.#window!.open(it.link.dashboardUrl, '_blank');
          return;
        }
        this.#window!.location.href = it.link.onboardingUrl!;
      }),
    );
  }
}

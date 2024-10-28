import {Injectable, inject} from '@angular/core';

import {Observable, catchError, concat, map, of, switchMap, tap} from 'rxjs';

import {injectWindow} from 'dfx-helper';
import {signalSlice} from 'ngxtension/signal-slice';

import {BackendType, injectAPI} from '@shared/api';
import {NotificationService} from '@shared/notifications/notification.service';

interface OrganisationStripeState {
  loading: boolean;
  organisationId: number | undefined;
  data: BackendType['GetStripeAccountResponse'][] | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class OrganisationsStripeService {
  #api = injectAPI();
  #window = injectWindow();
  #notificationService = inject(NotificationService);

  #initialState: OrganisationStripeState = {
    loading: true,
    organisationId: undefined,
    data: undefined,
  };

  #load$(organisationId: number) {
    return this.#api
      .get('/v1/config/stripe/account', {
        params: {
          query: {
            organisationId,
          },
        },
      })
      .pipe(map((data) => ({organisationId, data, loading: false})));
  }

  #create$(body: BackendType['CreateStripeAccountDto']) {
    return this.#api
      .post('/v1/config/stripe/account', {
        body,
      })
      .pipe(
        switchMap(({id}) => this.openLink$(id)),
        map(() => ({})),
      );
  }

  #update$(body: BackendType['UpdateStripeAccountDto']) {
    return this.#api.put('/v1/config/stripe/account', {body}).pipe(map(() => ({})));
  }

  #delete$(id: string) {
    return this.#api
      .delete('/v1/config/stripe/account/{id}', {
        params: {
          path: {
            id,
          },
        },
      })
      .pipe(
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
      create: (state, action$: Observable<BackendType['CreateStripeAccountDto']>) =>
        action$.pipe(switchMap((dto) => concat(of({loading: true}), this.#create$(dto), this.#load$(state().organisationId!)))),
      update: (state, action$: Observable<BackendType['UpdateStripeAccountDto']>) =>
        action$.pipe(switchMap((dto) => concat(of({loading: true}), this.#update$(dto), this.#load$(state().organisationId!)))),
      delete: (state, action$: Observable<string>) =>
        action$.pipe(
          switchMap((id) =>
            concat(
              of({
                loading: true,
                data: state().data?.filter((it) => it.id !== id),
              }),
              this.#delete$(id),
              this.#load$(state().organisationId!),
            ),
          ),
        ),
    },
  });

  openLink$(id: string) {
    return this.#api
      .get('/v1/config/stripe/account/{id}', {
        params: {
          path: {
            id,
          },
        },
      })
      .pipe(
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

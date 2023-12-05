import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {NonNullableFormBuilder, Validators} from '@angular/forms';

import {filter, interval, map, Observable, switchMap} from 'rxjs';

import {signalSlice} from 'ngxtension/signal-slice';

import {n_generate_int} from 'dfts-helper';

import {IdResponse} from '../_shared/waiterrobot-backend';

type MaxiOrderTry = {
  id: number;
  sent: Date;
  success: boolean;
};

type MaxiSession = {
  id: number;
  started: Date;
  ended?: Date;
  eventId: number;
  intervalInMs: number;
  orders: MaxiOrderTry[];
};

type MaxiState = {
  sessions: MaxiSession[];
  currentSession?: MaxiSession;
  intervalInMs: number;
  eventId?: number;
};

@Injectable({providedIn: 'root'})
export class MaxiService {
  private httpClient = inject(HttpClient);

  private initialState: MaxiState = {
    sessions: [],
    intervalInMs: 1000,
  };

  form = inject(NonNullableFormBuilder).group({
    intervalInMs: [10000, [Validators.required, Validators.min(0)]],
    eventId: [undefined as unknown as number, [Validators.required, Validators.min(0)]],
  });

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.form.valueChanges,
      (state) =>
        this.form.valueChanges.pipe(
          filter(({eventId, intervalInMs}) => !!eventId && !!intervalInMs),
          switchMap(({eventId, intervalInMs}) =>
            interval(intervalInMs ?? 10000).pipe(
              switchMap(() => this.httpClient.post<IdResponse>('/config/order/test/all', {}, {params: {eventId: eventId!}})),
            ),
          ),
          map((response) => {
            const currentSession = state().currentSession!;
            currentSession.orders = [...currentSession.orders, {id: response.id, sent: new Date(), success: true}];
            return {
              currentSession,
            };
          }),
        ),
    ],
    actionSources: {
      start: (state, action$: Observable<void>) =>
        action$.pipe(
          map(() => {
            const oldCurrentSession = state().currentSession;
            if (oldCurrentSession) {
              oldCurrentSession.ended = new Date();
            }

            return {
              sessions: oldCurrentSession ? [...state().sessions, oldCurrentSession] : state().sessions,
              currentSession: {
                id: n_generate_int(0, 100000000),
                started: new Date(),
                eventId: state().eventId!,
                intervalInMs: state().intervalInMs,
                orders: [],
              },
            };
          }),
        ),
      end: (state, action$: Observable<void>) =>
        action$.pipe(
          map(() => {
            const currentSession = state().currentSession;
            if (currentSession) {
              currentSession.ended = new Date();
            }
            return {
              sessions: currentSession ? [...state().sessions, currentSession] : state().sessions,
              currentSession: undefined,
            };
          }),
        ),
      add: (state, action$: Observable<MaxiSession>) =>
        action$.pipe(
          map((session) => ({
            sessions: [...state().sessions, session],
          })),
        ),
      remove: (state, action$: Observable<MaxiSession['id']>) =>
        action$.pipe(
          map((id) => ({
            sessions: state().sessions.filter((checklist) => checklist.id !== id),
          })),
        ),
    },
  });

  loaded$ = toObservable(this.state.eventId!).pipe(switchMap(() => this.httpClient.post('/config/order/test/all', {})));
}

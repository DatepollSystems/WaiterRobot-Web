import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {NonNullableFormBuilder, Validators} from '@angular/forms';

import {BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, Subject, switchMap, timer, withLatestFrom} from 'rxjs';

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
  successRate: number;
};

type MaxiState = {
  activeTab: 'CREATE' | number;
  sessions: MaxiSession[];
  currentSession: MaxiSession | null;
  currentSessionOrders: MaxiOrderTry[];
  intervalInMs: number;
  eventId: number | undefined;
};

@Injectable({providedIn: 'root'})
export class MaxiService {
  private httpClient = inject(HttpClient);

  private initialState: MaxiState = {
    activeTab: 'CREATE',
    sessions: [],
    intervalInMs: 1000,
    currentSession: null,
    currentSessionOrders: [],
    eventId: undefined,
  };

  form = inject(NonNullableFormBuilder).group({
    intervalInMs: [10000, [Validators.required, Validators.min(0)]],
    eventId: [undefined as unknown as number, [Validators.required, Validators.min(0)]],
  });

  running = new BehaviorSubject(false);

  load$ = new Subject<{intervalInMs: number; eventId: number}>();

  state = signalSlice({
    initialState: this.initialState,
    sources: [
      this.form.valueChanges,
      (state) =>
        this.load$.pipe(
          switchMap(({intervalInMs, eventId}) => combineLatest([of(eventId), timer(0, intervalInMs ?? 10000)])),
          withLatestFrom(this.running),
          filter(([, running]) => running),
          switchMap(([[eventId]]) =>
            this.httpClient.post<IdResponse>('/config/order/test/all', {}, {params: {eventId}}).pipe(
              map((response) => [...state().currentSessionOrders, {id: response.id, sent: new Date(), success: true}]),
              catchError(() => of([...state().currentSessionOrders, {id: n_generate_int(0, 100000000), sent: new Date(), success: false}])),
            ),
          ),
          map((currentSessionOrders) => {
            return {
              currentSession: {...state().currentSession!, successRate: calculateSuccessRate(currentSessionOrders)},
              currentSessionOrders,
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

            this.load$.next({intervalInMs: state().intervalInMs, eventId: state().eventId!});
            this.running.next(true);
            this.form.disable();
            return {
              sessions: oldCurrentSession ? [...state().sessions, oldCurrentSession] : state().sessions,
              currentSession: {
                id: n_generate_int(0, 1000),
                started: new Date(),
                eventId: state().eventId!,
                intervalInMs: state().intervalInMs,
                orders: [],
                successRate: 100,
              },
              currentSessionOrders: [],
              activeTab: 'CREATE',
            };
          }),
        ),
      end: (state, action$: Observable<void>) =>
        action$.pipe(
          map(() => {
            const currentSession = state().currentSession;
            if (currentSession) {
              currentSession.ended = new Date();
              currentSession.orders = state().currentSessionOrders.slice();
            }
            this.running.next(false);
            this.form.enable();
            return {
              activeTab: currentSession ? currentSession.id : 'CREATE',
              sessions: currentSession ? [...state().sessions, currentSession] : state().sessions,
              currentSession: null,
              currentSessionOrders: [],
            };
          }),
        ),
      remove: (state, action$: Observable<MaxiSession['id']>) =>
        action$.pipe(
          map((id) => ({
            sessions: state().sessions.filter((checklist) => checklist.id !== id),
          })),
        ),
    },
  });
}

function calculateSuccessRate(orders: MaxiOrderTry[]): number {
  if (orders.length === 0) {
    // If there are no orders, success rate is 0.
    return 100;
  }

  const successfulOrders = orders.filter((order) => order.success);
  const successRate = (successfulOrders.length / orders.length) * 100;

  // Round the success rate to two decimal places.
  return Math.round(successRate * 100) / 100;
}

import {effect, inject} from '@angular/core';

import {filter, pipe, switchMap, tap} from 'rxjs';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {BackendType, injectAPI} from '@shared/api';
import {setError, setFulfilled, setPending, withRequestStatus} from '@shared/api/request-status.feature';
import {withSelectionTable, withTable} from '@shared/api/table.feature';

export const EventLicensesStore = signalStore(
  {providedIn: 'root'},
  withState<{
    eventId: number | undefined;
    response: BackendType['EventLicencesResponse'] | undefined;
    license: BackendType['EventLicencesResponse']['licences'][0] | undefined;
  }>({response: undefined, license: undefined, eventId: undefined}),
  withRequestStatus(),
  withMethods((store, api = injectAPI(), modal = inject(NgbModal)) => {
    const load = rxMethod<number | undefined>(
      pipe(
        tap((eventId) => patchState(store, setPending(), () => ({eventId}))),
        filter((it): it is number => !!it),
        switchMap((eventId) =>
          api.get('/v1/config/event/licence', {params: {query: {eventId}}}).pipe(
            tapResponse({
              next: (response) => patchState(store, () => ({response}), setFulfilled()),
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    );
    return {
      load,
      loadSingle: rxMethod<number>(
        tap((id) => patchState(store, ({response}) => ({license: response?.licences?.find((it) => it.id === id)}))),
      ),
      create: rxMethod<BackendType['AddEventLicenceDto']>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((body) =>
            api.post('/v1/config/event/licence', {body}).pipe(
              tapResponse({
                next: () => {
                  patchState(store, setFulfilled());
                  load(store.eventId());
                },
                error: (error) => patchState(store, setError(error)),
              }),
            ),
          ),
        ),
      ),
      update: rxMethod<BackendType['UpdateEventLicenceDto']>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((body) =>
            api.put('/v1/config/event/licence', {body}).pipe(
              tapResponse({
                next: () => {
                  patchState(store, setFulfilled());
                  load(store.eventId());
                },
                error: (error) => patchState(store, setError(error)),
              }),
            ),
          ),
        ),
      ),
      delete: rxMethod<number>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((id) =>
            api.delete('/v1/config/event/licence/{id}', {params: {path: {id}}}).pipe(
              tapResponse({
                next: () => {
                  patchState(store, setFulfilled());
                  load(store.eventId());
                },
                error: (error) => patchState(store, setError(error)),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);

export const EventLicencesLicencesStore = signalStore(
  {providedIn: 'root'},
  withSelectionTable<BackendType['EventLicencesResponse']['licences'][0]>({
    columnsToDisplay: ['start', 'end', 'hours', 'note'],
  }),
  withMethods((store) => ({
    setAllEntities(entities: BackendType['EventLicencesResponse']['licences']) {
      patchState(store, setAllEntities(entities), setFulfilled());
    },
  })),
  withHooks({
    onInit(store, eventLicencesStore = inject(EventLicensesStore)) {
      effect(() => {
        const response = eventLicencesStore.response();
        if (response) {
          store.setAllEntities(response.licences);
        }
      });
    },
  }),
);

export const EventLicencesRangesStore = signalStore(
  {providedIn: 'root'},
  withTable<BackendType['EventLicencesResponse']['ranges'][0]>({
    columnsToDisplay: ['startDate', 'endDate'],
  }),
  withMethods((store) => ({
    setAllEntities(entities: BackendType['EventLicencesResponse']['ranges']) {
      patchState(store, setFulfilled(), setAllEntities(entities, {selectId: (it) => `${it.startDate}-${it.endDate}`}));
    },
  })),
  withHooks({
    onInit(store, eventLicencesStore = inject(EventLicensesStore)) {
      effect(() => {
        const response = eventLicencesStore.response();
        if (response) {
          store.setAllEntities(response.ranges);
        }
      });
    },
  }),
);

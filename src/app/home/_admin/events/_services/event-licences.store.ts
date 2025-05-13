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
  withState<{response: BackendType['EventLicencesResponse'] | undefined}>({response: undefined}),
  withRequestStatus(),
  withMethods((store, api = injectAPI(), modal = inject(NgbModal)) => ({
    load: rxMethod<number | null>(
      pipe(
        tap(() => patchState(store, setPending())),
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
    ),
  })),
);

export const EventLicencesLicencesStore = signalStore(
  {providedIn: 'root'},
  withSelectionTable<BackendType['EventLicencesResponse']['licences'][0]>({
    columnsToDisplay: ['start', 'end', 'hours'],
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

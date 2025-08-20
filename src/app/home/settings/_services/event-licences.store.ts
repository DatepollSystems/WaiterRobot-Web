import {effect, inject} from '@angular/core';
import {Router} from '@angular/router';

import {filter, map, pipe, switchMap, tap} from 'rxjs';

import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {n_from, n_isNumeric} from 'dfts-helper';

import {APIType, injectAPI} from '@shared/api';
import {setError, setFulfilled, setPending, withRequestStatus} from '@shared/api/request-status.feature';
import {withSelectionTable, withTable} from '@shared/api/table.feature';
import {SelectedOrganisationService} from '@shared/services';

export const EventLicencesStore = signalStore(
  {providedIn: 'root'},
  withState<{
    eventId: number | undefined;
    response: APIType['EventLicencesResponse'] | undefined;
    license: APIType['EventLicencesResponse']['licences'][0] | 'CREATE' | undefined;
  }>({response: undefined, license: undefined, eventId: undefined}),
  withRequestStatus(),
  withMethods((store, api = injectAPI(), selectedOrganisationService = inject(SelectedOrganisationService), router = inject(Router)) => {
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
      loadSingle: rxMethod<string | null>(
        pipe(
          map((id) => (n_isNumeric(id) ? n_from(id) : undefined)),
          tap((id) => {
            if (!id) {
              patchState(store, () => ({license: 'CREATE' as const}));
            }
          }),
          filter((id): id is number => !!id),
          tap((id) => patchState(store, ({response}) => ({license: response?.licences?.find((it) => it.id === id)}))),
        ),
      ),
      create: rxMethod<APIType['AddEventLicenceDto']>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((body) =>
            api.post('/v1/config/event/licence', {body}).pipe(
              tapResponse({
                next: () => {
                  patchState(store, setFulfilled());
                  load(store.eventId());
                  void router.navigate([`/o/${selectedOrganisationService.selectedId()}/e/${store.eventId()}/settings/licences`]);
                },
                error: (error) => patchState(store, setError(error)),
              }),
            ),
          ),
        ),
      ),
      update: rxMethod<APIType['UpdateEventLicenceDto']>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((body) =>
            api.put('/v1/config/event/licence', {body}).pipe(
              tapResponse({
                next: () => {
                  patchState(store, setFulfilled());
                  load(store.eventId());
                  void router.navigate([`/o/${selectedOrganisationService.selectedId()}/e/${store.eventId()}/settings/licences`]);
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
  withSelectionTable<APIType['EventLicencesResponse']['licences'][0]>({
    columnsToDisplay: ['start', 'end', 'hours', 'note', 'actions'],
  }),
  withMethods((store) => ({
    setAllEntities(entities: APIType['EventLicencesResponse']['licences']) {
      patchState(store, setAllEntities(entities), setFulfilled());
    },
  })),
  withHooks({
    onInit(store, eventLicencesStore = inject(EventLicencesStore)) {
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
  withTable<APIType['EventLicencesResponse']['ranges'][0]>({
    columnsToDisplay: ['startDate', 'endDate'],
  }),
  withMethods((store) => ({
    setAllEntities(entities: APIType['EventLicencesResponse']['ranges']) {
      patchState(store, setFulfilled(), setAllEntities(entities, {selectId: (it) => `${it.startDate}-${it.endDate}`}));
    },
  })),
  withHooks({
    onInit(store, eventLicencesStore = inject(EventLicencesStore)) {
      effect(() => {
        const response = eventLicencesStore.response();
        if (response) {
          store.setAllEntities(response.ranges);
        }
      });
    },
  }),
);

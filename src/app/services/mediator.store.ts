import {inject} from '@angular/core';

import {pipe, switchMap, tap} from 'rxjs';

import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {APIType, injectAPI} from '../api';
import {setError, setFulfilled, setPending} from '../api/request-status.feature';
import {withTable} from '../api/table.feature';
import {SelectedOrganisationService} from './selected-organisation.service';

export const MediatorStore = signalStore(
  {providedIn: 'root'},
  withTable<APIType['GetMediatorResponse']>({
    columnsToDisplay: ['id', 'name', 'active', 'lastContact', 'printers'],
  }),
  withState({}),
  withMethods((store, api = injectAPI(), selectedOrganisationService = inject(SelectedOrganisationService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          api.get('/v1/config/mediator', {params: {query: {organisationId: selectedOrganisationService.selectedId()!}}}).pipe(
            tapResponse({
              next: (mediators) => patchState(store, setAllEntities(mediators), setFulfilled()),
              error: (error) => patchState(store, setError(error)),
            }),
          ),
        ),
      ),
    ),
  })),
);

import {inject} from '@angular/core';

import {pipe, switchMap, tap} from 'rxjs';

import {tapResponse} from '@ngrx/operators';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {setAllEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

import {BackendType, injectAPI} from '@shared/api';
import {setError, setFulfilled, setPending} from '@shared/api/request-status.feature';
import {withTable} from '@shared/api/table.feature';
import {SelectedOrganisationService} from '@shared/services';

export const MediatorStore = signalStore(
  {providedIn: 'root'},
  withTable<BackendType['GetMediatorResponse']>({
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

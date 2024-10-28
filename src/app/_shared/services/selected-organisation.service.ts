import {Injectable, computed, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {BehaviorSubject, catchError, filter, map, merge, of, switchMap} from 'rxjs';

import {n_fromStorage, notNullAndUndefined, st_set} from 'dfts-helper';
import {connect} from 'ngxtension/connect';

import {BackendType, injectAPI} from '@shared/api';

interface SelectedOrganisationState {
  status: 'UNSET' | 'LOADING' | 'LOADED';
  selectedId?: number;
  selected?: BackendType['GetOrganisationResponse'];
}

export const selectedOrganisationRouteParamKey = 'soId';

@Injectable({providedIn: 'root'})
export class SelectedOrganisationService {
  #api = injectAPI();

  private selectedIdChange$ = new BehaviorSubject<number | undefined>(n_fromStorage(selectedOrganisationRouteParamKey));

  private selectedLoaded$ = this.selectedIdChange$.pipe(
    filter(notNullAndUndefined),
    switchMap((id) =>
      this.#api.get('/v1/config/organisation/{id}', {
        params: {
          path: {
            id,
          },
        },
      }),
    ),
    catchError(() => of(undefined)),
  );

  private selectedState = signal<SelectedOrganisationState>({status: 'UNSET'});

  constructor() {
    connect(
      this.selectedState,
      merge(
        this.selectedIdChange$.pipe(
          map((selectedId) => ({
            selectedId,
            selected: undefined,
            status: selectedId ? ('LOADING' as const) : ('UNSET' as const),
          })),
        ),
        this.selectedLoaded$.pipe(map((selected) => ({selected, status: 'LOADED' as const}))),
      ),
    );
  }

  setSelected(it: number | undefined): void {
    st_set(selectedOrganisationRouteParamKey, it);
    this.selectedIdChange$.next(it);
  }

  status = computed(() => this.selectedState().status);
  selectedId = computed(() => this.selectedState().selectedId);
  selected = computed(() => this.selectedState().selected);

  selectedId$ = toObservable(this.selectedId);
  selectedIdNotNull$ = this.selectedId$.pipe(filter(notNullAndUndefined));
}

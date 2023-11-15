import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {BehaviorSubject, catchError, EMPTY, filter, map, merge, switchMap} from 'rxjs';

import {connect} from 'ngxtension/connect';

import {n_fromStorage, notNullAndUndefined, st_set} from 'dfts-helper';

import {GetOrganisationResponse} from '../../../_shared/waiterrobot-backend';

type SelectedOrganisationState = {
  status: 'UNSET' | 'LOADING' | 'LOADED';
  selectedId?: number;
  selected?: GetOrganisationResponse;
};

export const selectedOrganisationRouteParamKey = 'soId';

@Injectable({providedIn: 'root'})
export class SelectedOrganisationService {
  private httpClient = inject(HttpClient);

  private selectedIdChange$ = new BehaviorSubject<number | undefined>(n_fromStorage(selectedOrganisationRouteParamKey));

  private selectedLoaded$ = this.selectedIdChange$.pipe(
    filter(notNullAndUndefined),
    switchMap((organisationId) => this.httpClient.get<GetOrganisationResponse>(`/config/organisation/${organisationId}`)),
    catchError(() => EMPTY),
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
  selected$ = toObservable(this.selected);
  selectedNotNull$ = this.selected$.pipe(filter(notNullAndUndefined));
}

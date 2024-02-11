import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {BehaviorSubject, catchError, combineLatest, filter, map, merge, of, switchMap} from 'rxjs';

import {connect} from 'ngxtension/connect';
import {GetEventOrLocationResponse} from '@shared/waiterrobot-backend';

import {n_fromStorage, notNullAndUndefined, st_set} from 'dfts-helper';

import {SelectedOrganisationService} from '../../organisations/_services/selected-organisation.service';

type SelectedEventState = {
  status: 'UNSET' | 'LOADING' | 'LOADED';
  selectedId?: number;
  selected?: GetEventOrLocationResponse;
};

export const selectedEventRouteParamKey = 'seId';

@Injectable({providedIn: 'root'})
export class SelectedEventService {
  private httpClient = inject(HttpClient);
  private selectedOrganisationService = inject(SelectedOrganisationService);

  private selectedIdChange = new BehaviorSubject<number | undefined>(n_fromStorage(selectedEventRouteParamKey));

  private selectedLoaded$ = this.selectedIdChange.pipe(
    filter(notNullAndUndefined),
    switchMap((eventId) =>
      combineLatest([
        this.selectedOrganisationService.selectedId$,
        this.httpClient.get<GetEventOrLocationResponse>(`/config/event/${eventId}`),
      ]),
    ),
    map(([selectedOrganisationId, selectedEvent]) => {
      if (selectedOrganisationId && selectedEvent.organisationId === selectedOrganisationId) {
        return selectedEvent;
      }

      this.setSelected(undefined);
      return undefined;
    }),
    catchError(() => of(undefined)),
  );

  private selectedState = signal<SelectedEventState>({status: 'UNSET'});

  constructor() {
    connect(
      this.selectedState,
      merge(
        this.selectedIdChange.pipe(
          map((selectedId) => ({
            selectedId,
            selected: undefined,
            status: selectedId ? ('LOADING' as const) : ('UNSET' as const),
          })),
        ),
        this.selectedLoaded$.pipe(map((selected) => ({selected, status: selected ? ('LOADED' as const) : ('UNSET' as const)}))),
      ),
    );
  }

  setSelected(it: number | undefined): void {
    st_set(selectedEventRouteParamKey, it);
    this.selectedIdChange.next(it);
  }

  status = computed(() => this.selectedState().status);
  selectedId = computed(() => this.selectedState().selectedId);
  selected = computed(() => this.selectedState().selected);

  selectedId$ = toObservable(this.selectedId);
  selectedIdNotNull$ = this.selectedId$.pipe(filter(notNullAndUndefined));
  selected$ = toObservable(this.selected);
  selectedNotNull$ = this.selected$.pipe(filter(notNullAndUndefined));
}

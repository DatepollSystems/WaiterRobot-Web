import {Injectable, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {switchMap} from 'rxjs';

import {injectAPI} from '../api';
import {SelectedEventService} from './selected-event.service';

@Injectable({providedIn: 'root'})
export class StatisticsService {
  #api = injectAPI();

  #selectedEventId$ = inject(SelectedEventService).selectedIdNotNull$;

  counts = toSignal(
    this.#selectedEventId$.pipe(switchMap((eventId) => this.#api.get('/v1/config/statistics/counts', {params: {query: {eventId}}}))),
  );

  sumProductGroups = toSignal(
    this.#selectedEventId$.pipe(
      switchMap((eventId) => this.#api.get('/v1/config/statistics/sumProductGroups', {params: {query: {eventId}}})),
    ),
    {initialValue: []},
  );

  sumProducts = toSignal(
    this.#selectedEventId$.pipe(switchMap((eventId) => this.#api.get('/v1/config/statistics/sumProducts', {params: {query: {eventId}}}))),
    {initialValue: []},
  );

  sumProductsPerWaiter = toSignal(
    this.#selectedEventId$.pipe(
      switchMap((eventId) => this.#api.get('/v1/config/statistics/sumProductsPerWaiter', {params: {query: {eventId}}})),
    ),
    {initialValue: []},
  );
}

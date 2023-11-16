import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';

import {map, switchMap} from 'rxjs';

import {computedFrom} from 'ngxtension/computed-from';

import {SelectedEventService} from '../events/_services/selected-event.service';
import {StatisticsCountResponse, StatisticsSumResponse} from '../../_shared/waiterrobot-backend';

@Injectable({providedIn: 'root'})
export class StatisticsService {
  private httpClient = inject(HttpClient);

  private selectedEventId$ = inject(SelectedEventService).selectedIdNotNull$;

  loadCount = toSignal(
    this.selectedEventId$.pipe(
      switchMap((eventId) => this.httpClient.get<StatisticsCountResponse>('/config/statistics/counts', {params: {eventId}})),
      map((response) => ({...response, turnover: (response.turnover ?? 0) / 100})),
    ),
  );

  counts = computedFrom(
    [this.selectedEventId$],
    switchMap(([eventId]) => this.httpClient.get<StatisticsCountResponse>('/config/statistics/counts', {params: {eventId}})),
    {initialValue: undefined},
  );

  sumProductGroups = computedFrom(
    [this.selectedEventId$],
    switchMap(([eventId]) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductGroups', {params: {eventId}})),
    {initialValue: []},
  );

  sumProducts = computedFrom(
    [this.selectedEventId$],
    switchMap(([eventId]) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProducts', {params: {eventId}})),
    {initialValue: []},
  );

  sumProductsPerWaiter = computedFrom(
    [this.selectedEventId$],
    switchMap(([eventId]) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductsPerWaiter', {params: {eventId}})),
    {initialValue: []},
  );
}

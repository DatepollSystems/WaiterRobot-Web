import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';

import {StatisticsCountResponse, StatisticsSumResponse} from '@shared/waiterrobot-backend';

import {switchMap} from 'rxjs';
import {SelectedEventService} from '../_admin/events/_services/selected-event.service';

@Injectable({providedIn: 'root'})
export class StatisticsService {
  private httpClient = inject(HttpClient);

  private selectedEventId$ = inject(SelectedEventService).selectedIdNotNull$;

  counts = toSignal(
    this.selectedEventId$.pipe(
      switchMap((eventId) => this.httpClient.get<StatisticsCountResponse>('/config/statistics/counts', {params: {eventId}})),
    ),
  );

  sumProductGroups = toSignal(
    this.selectedEventId$.pipe(
      switchMap((eventId) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductGroups', {params: {eventId}})),
    ),
    {initialValue: []},
  );

  sumProducts = toSignal(
    this.selectedEventId$.pipe(
      switchMap((eventId) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProducts', {params: {eventId}})),
    ),
    {initialValue: []},
  );

  sumProductsPerWaiter = toSignal(
    this.selectedEventId$.pipe(
      switchMap((eventId) => this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductsPerWaiter', {params: {eventId}})),
    ),
    {initialValue: []},
  );
}

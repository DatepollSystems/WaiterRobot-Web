import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';

import {filter, switchMap} from 'rxjs';

import {notNullAndUndefined} from 'dfts-helper';

import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template:
    ' <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos" chartType="PIE">{{ \'HOME_PROD_GROUP\' | tr }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-product-groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductGroupsComponent {
  sumDtos$ = this.eventsService.getSelected$.pipe(
    filter(notNullAndUndefined),
    switchMap((event) =>
      this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductGroups', {
        params: new HttpParams().set('eventId', event.id),
      }),
    ),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}
}

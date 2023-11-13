import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';

import {switchMap} from 'rxjs';

import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template:
    ' <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos" chartType="PIE">{{ \'HOME_PROD_GROUPS\' | tr }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-product-groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductGroupsComponent {
  sumDtos$ = this.eventsService.getSelectedNotNull$.pipe(
    switchMap(({id: eventId}) =>
      this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductGroups', {
        params: {eventId},
      }),
    ),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}
}

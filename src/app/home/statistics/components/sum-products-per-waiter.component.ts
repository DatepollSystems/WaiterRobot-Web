import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';

import {switchMap} from 'rxjs';

import {StatisticsSumResponse} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';

@Component({
  template:
    ' <app-sum-statistics *ngIf="sumDtos$ | async as sumDtos" [sumDtos]="sumDtos">{{ \'HOME_STATISTICS_PRODUCTS_PER_WAITER\' | tr }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-products-per-waiter',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsPerWaiterComponent {
  sumDtos$ = this.eventsService.getSelectedNotNull$.pipe(
    switchMap(({id: eventId}) =>
      this.httpClient.get<StatisticsSumResponse[]>('/config/statistics/sumProductsPerWaiter', {
        params: {eventId},
      }),
    ),
  );

  constructor(
    private httpClient: HttpClient,
    private eventsService: EventsService,
  ) {}
}

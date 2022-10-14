import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  selector: 'app-sum-products-per-waiter-statistics',
  templateUrl: './sum-products-per-waiter-statistics.component.html',
  styleUrls: ['./sum-products-per-waiter-statistics.component.scss'],
})
export class SumProductsPerWaiterStatisticsComponent extends AComponent {
  sumDtos?: {name: string; value: number}[];

  constructor(http: HttpClient, eventsServie: EventsService) {
    super();

    this.unsubscribe(
      http
        .get<typeof this.sumDtos>('/config/statistics/sumProductsPerWaiter', {
          params: new HttpParams().set('eventId', eventsServie.getSelected()!.id),
        })
        .subscribe((it) => (this.sumDtos = it))
    );
  }
}

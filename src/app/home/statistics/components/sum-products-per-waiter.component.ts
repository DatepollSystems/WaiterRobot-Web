import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  template: ` <app-sum-statistics [sumDtos]="sumDtos">{{ 'HOME_STATISTICS_PRODUCTS_PER_WAITER' | tr }}</app-sum-statistics> `,
  selector: 'app-statistics-sum-products-per-waiter',
})
export class SumProductsPerWaiterComponent extends AComponent {
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

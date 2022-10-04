import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';
import {LegendPosition} from '@swimlane/ngx-charts';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  selector: 'app-sum-products-statistics',
  templateUrl: './sum-products-statistics.component.html',
  styleUrls: ['./sum-products-statistics.component.scss'],
})
export class SumProductsStatisticsComponent extends AComponent {
  chartType: 'PIE' | 'BAR' = 'BAR';

  sumProducts?: {name: string; value: number}[];

  constructor(http: HttpClient, eventsServie: EventsService) {
    super();

    this.unsubscribe(
      http
        .get<typeof this.sumProducts>('/config/statistics/sumProducts', {
          params: new HttpParams().set('eventId', eventsServie.getSelected()!.id),
        })
        .subscribe((it) => (this.sumProducts = it))
    );
  }

  setChartType(it: typeof this.chartType) {
    this.chartType = it;
  }

  position = LegendPosition.Below;
}

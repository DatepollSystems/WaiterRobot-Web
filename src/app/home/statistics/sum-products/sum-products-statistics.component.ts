import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  selector: 'app-sum-products-statistics',
  templateUrl: './sum-products-statistics.component.html',
  styleUrls: ['./sum-products-statistics.component.scss'],
})
export class SumProductsStatisticsComponent extends AComponent {
  @Input() set standalone(it: BooleanInput) {
    this._standalone = coerceBooleanProperty(it);
  }
  _standalone = false;

  sumDtos?: {name: string; value: number}[];

  constructor(http: HttpClient, eventsServie: EventsService) {
    super();

    this.unsubscribe(
      http
        .get<typeof this.sumDtos>('/config/statistics/sumProducts', {
          params: new HttpParams().set('eventId', eventsServie.getSelected()!.id),
        })
        .subscribe((it) => {
          this.sumDtos = this._standalone ? it : it?.slice(0, 20);
        })
    );
  }
}

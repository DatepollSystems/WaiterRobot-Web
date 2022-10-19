import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';

import {AComponent} from 'dfx-helper';
import {StatisticsSumResponse} from '../../../_models/waiterrobot-backend';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  template: `
    <app-sum-statistics [sumDtos]="sumDtos">
      <span>{{ 'HOME_PROD_ALL' | tr }}</span>
      <div bottom class="d-flex justify-content-end" *ngIf="!_standalone">
        <button class="btn btn-info">{{ 'SHOW_MORE' | tr }}</button>
      </div>
    </app-sum-statistics>
  `,
  selector: 'app-statistics-sum-products',
})
export class SumProductsComponent extends AComponent {
  @Input() set standalone(it: BooleanInput) {
    this._standalone = coerceBooleanProperty(it);
  }

  _standalone = false;

  sumDtos?: StatisticsSumResponse[];

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

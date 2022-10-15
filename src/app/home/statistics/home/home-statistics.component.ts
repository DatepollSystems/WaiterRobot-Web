import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AComponent} from 'dfx-helper';
import {GetProductMinResponse, GetWaiterMinResponse} from '../../../_models/waiterrobot-backend';
import {EventsService} from '../../../_services/models/events.service';

@Component({
  selector: 'app-home-statistics',
  templateUrl: './home-statistics.component.html',
  styleUrls: ['./home-statistics.component.scss'],
})
export class HomeStatisticsComponent extends AComponent {
  countDto?: {
    orderedProducts: number;
    orders: number;
    turnover: number;
    bestWaiter: GetWaiterMinResponse;
    bestProduct: GetProductMinResponse;
  };

  constructor(public route: ActivatedRoute, http: HttpClient, eventsService: EventsService) {
    super();

    this.unsubscribe(
      http
        .get<typeof this.countDto>('/config/statistics/counts', {
          params: new HttpParams().set('eventId', eventsService.getSelected()!.id),
        })
        .subscribe((it) => {
          this.countDto = it;
          if (this.countDto) {
            this.countDto.turnover = this.countDto.turnover / 100;
          }
        })
    );
  }
}

import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AComponent} from 'dfx-helper';
import {EventsService} from '../../_services/models/events.service';

@Component({
  template: `
    <h1>{{ 'WHOLE' | tr }} {{ 'NAV_STATISTICS' | tr }}</h1>

    <div class="row mb-4 row-cols-1 row-cols-md-2 row-cols-xl-4 gy-3">
      <div class="col">
        <app-statistics-count-card [count]="countDto?.orderedProducts">{{
          'HOME_STATISTICS_SELLED_PRODUCTS' | tr
        }}</app-statistics-count-card>
      </div>

      <div class="col">
        <app-statistics-count-card [count]="countDto?.orders">{{ 'HOME_STATISTICS_ORDERS' | tr }}</app-statistics-count-card>
      </div>

      <div class="col">
        <app-statistics-count-card [count]="countDto?.turnover">
          <span>{{ 'HOME_STATISTICS_TURNOVER' | tr }}</span>
          <span valuePrefix>€</span>
        </app-statistics-count-card>
      </div>

      <div class="col">
        <div class="card h-100">
          <div class="card-body text-center d-flex flex-column gap-2">
            <h4>{{ 'HOME_STATISTICS_BEST_WAITER' | tr }}</h4>
            <p style="font-size: 2rem">{{ countDto?.bestWaiter?.name ?? '-' }} ({{ countDto?.bestWaiter?.value }}€)</p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card h-100">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <h4>{{ 'HOME_STATISTICS_BEST_PRODUCT' | tr }}</h4>
            <p style="font-size: 2rem">{{ countDto?.bestProduct?.name ?? '-' }} ({{ countDto?.bestProduct?.value }}x)</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4 row-cols-1 row-cols-lg-2 gy-2">
      <div class="col">
        <app-statistics-sum-productgroups></app-statistics-sum-productgroups>
      </div>
      <div class="col">
        <app-statistics-sum-products></app-statistics-sum-products>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <app-statistics-sum-products-per-waiter></app-statistics-sum-products-per-waiter>
      </div>
      <div class="col"></div>
    </div>
  `,
  selector: 'app-statistics-overview',
})
export class StatisticsOverviewComponent extends AComponent {
  countDto?: {
    orderedProducts: number;
    orders: number;
    turnover: number;
    bestWaiter: {name: string; value: number};
    bestProduct: {name: string; value: number};
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
            if (this.countDto.bestWaiter) {
              this.countDto.bestWaiter.value = this.countDto.bestWaiter.value / 100;
            }
          }
        })
    );
  }
}

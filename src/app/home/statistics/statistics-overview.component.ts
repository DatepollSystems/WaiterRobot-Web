import {HttpClient, HttpParams} from '@angular/common/http';
import {Component} from '@angular/core';
import {filter, map, switchMap} from 'rxjs';
import {StatisticsCountResponse} from 'src/app/_shared/waiterrobot-backend';
import {notNullAndUndefined} from '../../_shared/services/abstract-entity.service';
import {EventsService} from '../events/_services/events.service';

@Component({
  template: `
    <h1>{{ 'WHOLE' | tr }} {{ 'NAV_STATISTICS' | tr }}</h1>

    <div class="row mt-2 mb-4 row-cols-1 row-cols-md-2 row-cols-xl-4 gy-3" *ngIf="countDto$ | async as countDto">
      <div class="col">
        <app-statistics-count-card [count]="countDto.orderedProducts">{{
          'HOME_STATISTICS_SELLED_PRODUCTS' | tr
        }}</app-statistics-count-card>
      </div>

      <div class="col">
        <app-statistics-count-card [count]="countDto.orders">{{ 'HOME_STATISTICS_ORDERS' | tr }}</app-statistics-count-card>
      </div>

      <div class="col">
        <app-statistics-count-card [count]="countDto.turnover">
          <span>{{ 'HOME_STATISTICS_TURNOVER' | tr }}</span>
          <span valuePrefix>€</span>
        </app-statistics-count-card>
      </div>

      <div class="col">
        <div class="card h-100">
          <div class="card-body text-center d-flex flex-column gap-2">
            <h4>{{ 'HOME_STATISTICS_BEST_WAITER' | tr }}</h4>
            <p style="font-size: 2rem">{{ countDto.bestWaiter?.name ?? '-' }} ({{ countDto.bestWaiter?.value ?? 0 }})</p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card h-100">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <h4>{{ 'HOME_STATISTICS_BEST_PRODUCT' | tr }}</h4>
            <p style="font-size: 2rem">{{ countDto.bestProduct?.name ?? '-' }} ({{ countDto.bestProduct?.value }}x)</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <app-statistics-timeline />
    </div>

    <div class="row mb-4 row-cols-1 row-cols-lg-2 gy-2">
      <div class="col">
        <app-statistics-sum-product-groups />
      </div>
      <div class="col">
        <app-statistics-sum-products />
      </div>
    </div>

    <div class="row mb-4 row-cols-1 row-cols-lg-2 gy-2">
      <div class="col">
        <app-statistics-sum-products-per-waiter />
      </div>
      <div class="col"></div>
    </div>
  `,
  selector: 'app-statistics-overview',
})
export class StatisticsOverviewComponent {
  countDto$ = this.eventsService.getSelected$.pipe(
    filter(notNullAndUndefined),
    switchMap((event) =>
      this.httpClient.get<StatisticsCountResponse>('/config/statistics/counts', {params: new HttpParams().set('eventId', event.id)})
    ),
    map((response) => {
      response.turnover = (response.turnover ?? 0) / 100;
      return response;
    })
  );

  constructor(private httpClient: HttpClient, private eventsService: EventsService) {}
}

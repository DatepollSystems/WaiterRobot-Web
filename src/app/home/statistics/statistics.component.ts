import {Component, inject} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

import {StatisticsService} from './statistics.service';

@Component({
  template: `
    <div class="d-flex gap-3">
      <h1 class="my-0">{{ 'WHOLE' | tr }} {{ 'NAV_STATISTICS' | tr }}</h1>
      <app-blur-toggle />
    </div>

    @if (countDto$(); as countDto) {
      <div class="row mt-2 mb-4 row-cols-1 row-cols-md-2 row-cols-xl-4 gy-3">
        <div class="col">
          <app-statistics-count-card [count]="countDto.orderedProducts"
            >{{ 'HOME_STATISTICS_SELLED_PRODUCTS' | tr }}
          </app-statistics-count-card>
        </div>

        <div class="col">
          <app-statistics-count-card [count]="countDto.orders">{{ 'NAV_ORDERS' | tr }}</app-statistics-count-card>
        </div>

        <div class="col">
          <app-statistics-count-card [count]="countDto.turnover">
            <span>{{ 'HOME_STATISTICS_TURNOVER' | tr }}</span>
            <span valuePrefix>€</span>
          </app-statistics-count-card>
        </div>

        <div class="col">
          <div class="card h-100">
            <div class="card-body d-flex flex-column justify-content-between align-items-center gap-2">
              <h4 class="mt-1">{{ 'HOME_STATISTICS_BEST_WAITER' | tr }}</h4>
              <div style="font-size: 2rem" class="text-center" [class.unblur]="isBlurred()">
                @if (countDto.bestWaiter) {
                  {{ countDto.bestWaiter.name }} ({{ countDto.bestWaiter.value }})
                } @else {
                  <span>{{ 'UNKNOWN' | tr }}</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100">
            <div class="card-body d-flex flex-column justify-content-between align-items-center gap-2">
              <h4 class="mt-1">{{ 'HOME_STATISTICS_BEST_PRODUCT' | tr }}</h4>
              <div style="font-size: 2rem" class="text-center" [class.unblur]="isBlurred()">
                @if (countDto.bestProduct) {
                  {{ countDto.bestProduct.name }} ({{ countDto.bestProduct.value }}x)
                } @else {
                  <span>{{ 'UNKNOWN' | tr }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }

    <hr />

    <div class="row mb-4">
      <app-statistics-timeline />
    </div>

    <hr style="margin-top: -80px" />

    <div class="row mb-4 row-cols-1 row-cols-lg-2 gy-2">
      <div class="col">
        <app-statistics-sum-product-groups />
      </div>
      <div class="col">
        <app-statistics-sum-products standalone="false" />
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
export class StatisticsComponent {
  countDto$ = inject(StatisticsService).counts;

  isBlurred = injectBlurSetting().isBlurred;
}

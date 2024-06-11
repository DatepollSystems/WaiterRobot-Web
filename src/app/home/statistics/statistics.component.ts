import {Component, inject} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

import {StatisticsService} from './statistics.service';

@Component({
  template: `
    <div class="d-flex gap-3 justify-content-between justify-content-md-start">
      <h1 class="my-0 d-inline-flex align-items-center">{{ 'NAV_STATISTICS' | transloco }}</h1>
      <app-blur-toggle />
    </div>

    @if (statisticsCount(); as countDto) {
      <div class="row mt-2 mb-4 row-cols-1 row-cols-md-2 row-cols-xxl-4 gy-3">
        <div class="col">
          <app-statistics-card>
            <bi icon size="32" name="cup-straw" />
            <span description>{{ 'HOME_STATISTICS_SELLED_PRODUCTS' | transloco }}</span>
            <span value>{{ countDto.orderedProducts }}</span>
          </app-statistics-card>
        </div>

        <div class="col">
          <app-statistics-card>
            <bi icon name="list-check" size="32" />
            <span description>{{ 'NAV_ORDERS' | transloco }}</span>
            <span value>{{ countDto.orders }}</span>
          </app-statistics-card>
        </div>

        <div class="col">
          <app-statistics-card>
            <bi icon name="cash-coin" size="32" />
            <span description>{{ 'HOME_STATISTICS_TURNOVER' | transloco }}</span>
            <span value>{{ countDto.turnover | currency }}</span>
          </app-statistics-card>
        </div>

        <div class="col">
          <app-statistics-card>
            <bi icon size="32" name="star" />
            <span description>{{ 'HOME_STATISTICS_BEST_PRODUCT' | transloco }}</span>
            <span value>
                    @if (countDto.bestProduct; as bestProduct) {
                      {{ bestProduct.name }}
                    } @else {
                      {{ 'UNKNOWN' | transloco }}
                    }
            </span>
          </app-statistics-card>
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
  statisticsCount = inject(StatisticsService).counts;

  isBlurred = injectBlurSetting().isBlurred;
}

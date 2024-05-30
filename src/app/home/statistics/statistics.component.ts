import {Component, inject} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

import {StatisticsService} from './statistics.service';

@Component({
  template: `
    <div class="d-flex gap-3 justify-content-between justify-content-md-start">
      <h1 class="my-0 d-inline-flex align-items-center">{{ 'WHOLE' | transloco }} {{ 'NAV_STATISTICS' | transloco }}</h1>
      <app-blur-toggle />
    </div>

    @if (statisticsCount(); as countDto) {
      <div class="row mt-2 mb-4 row-cols-1 row-cols-md-2 row-cols-xxl-4 gy-3">
        <div class="col">
          <app-statistics-count-card [count]="countDto.orderedProducts"
            >{{ 'HOME_STATISTICS_SELLED_PRODUCTS' | transloco }}
            <bi icon width="32" height="32" name="cup-straw" />
          </app-statistics-count-card>
        </div>

        <div class="col">
          <app-statistics-count-card [count]="countDto.orders">
            {{ 'NAV_ORDERS' | transloco }}
            <bi icon name="list-check" width="32" height="32" />
          </app-statistics-count-card>
        </div>

        <div class="col">
          <app-statistics-count-card [count]="countDto.turnover">
            <span>{{ 'HOME_STATISTICS_TURNOVER' | transloco }}</span>
            <span valuePrefix>€</span>
            <bi icon width="32" height="32" name="cash-coin" />
          </app-statistics-count-card>
        </div>

        <div class="col">
          <div class="card bg-body-tertiary">
            <div class="card-body">
              <div class="d-flex align-items-center gap-2">
                <div
                  class="rounded-5 bg-info-subtle d-inline-flex align-items-center justify-content-center"
                  style="width: 60px; height: 60px; padding-top: 4px"
                >
                  <bi width="32" height="32" name="star" />
                </div>
                <div class="d-flex flex-column">
                  <div class="fs-4 blur" [class.unblur]="!isBlurred()">
                    @if (countDto.bestProduct; as bestProduct) {
                      {{ bestProduct.name }}
                    } @else {
                      <span>{{ 'UNKNOWN' | transloco }}</span>
                    }
                  </div>
                  <span class="fs-6">{{ 'HOME_STATISTICS_BEST_PRODUCT' | transloco }}</span>
                </div>
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
  statisticsCount = inject(StatisticsService).counts;

  isBlurred = injectBlurSetting().isBlurred;
}

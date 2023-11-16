import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {StatisticsService} from '../statistics.service';

@Component({
  template: ' <app-sum-statistics [sumDtos]="sumDtos()">{{ \'HOME_STATISTICS_PRODUCTS_PER_WAITER\' | tr }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-products-per-waiter',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductsPerWaiterComponent {
  sumDtos = inject(StatisticsService).sumProductsPerWaiter;
}

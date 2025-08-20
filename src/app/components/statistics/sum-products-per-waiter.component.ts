import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {StatisticsService} from '../../services/statistics.service';

@Component({
  template: ' <app-sum-statistics [sumDtos]="sumDtos()">{{ \'HOME_STATISTICS_PRODUCTS_PER_WAITER\' | transloco }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-products-per-waiter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SumProductsPerWaiterComponent {
  sumDtos = inject(StatisticsService).sumProductsPerWaiter;
}

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {StatisticsService} from '../statistics.service';

@Component({
  template: ' <app-sum-statistics [sumDtos]="sumDtos()" chartType="PIE">{{ \'HOME_PROD_GROUPS\' | tr }}</app-sum-statistics> ',
  selector: 'app-statistics-sum-product-groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumProductGroupsComponent {
  sumDtos = inject(StatisticsService).sumProductGroups;
}

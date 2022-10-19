import {Component, Input} from '@angular/core';
import {StatisticsSumResponse} from '../../../../_models/waiterrobot-backend';

@Component({
  selector: 'app-sum-statistics',
  templateUrl: './sum-statistics.component.html',
  styleUrls: ['./sum-statistics.component.scss'],
})
export class SumStatisticsComponent {
  @Input()
  chartType: 'PIE' | 'BAR' | 'TEXT' = 'BAR';

  @Input()
  sumDtos?: StatisticsSumResponse[];

  setChartType(it: typeof this.chartType) {
    this.chartType = it;
  }
}

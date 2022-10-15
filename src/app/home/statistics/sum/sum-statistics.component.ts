import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sum-statistics',
  templateUrl: './sum-statistics.component.html',
  styleUrls: ['./sum-statistics.component.scss'],
})
export class SumStatisticsComponent {
  @Input()
  chartType: 'PIE' | 'BAR' | 'TEXT' = 'BAR';

  @Input()
  sumDtos?: {name: string; value: number}[];

  setChartType(it: typeof this.chartType) {
    this.chartType = it;
  }
}

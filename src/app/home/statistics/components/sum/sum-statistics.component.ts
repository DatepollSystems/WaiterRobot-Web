import {ChangeDetectionStrategy, Component, Input, numberAttribute} from '@angular/core';
import {injectBlurSetting} from '@home-shared/services/blur-setting.service';

import {StatisticsSumResponse} from '@shared/waiterrobot-backend';

@Component({
  selector: 'app-sum-statistics',
  templateUrl: './sum-statistics.component.html',
  styleUrl: './sum-statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SumStatisticsComponent {
  @Input()
  chartType: 'PIE' | 'BAR' | 'TEXT' = 'BAR';

  @Input()
  sumDtos?: StatisticsSumResponse[];

  @Input({transform: numberAttribute})
  set height(it: number) {
    this._height = `${it}vh`;
  }
  _height = '50vh';

  setChartType(it: typeof this.chartType): void {
    this.chartType = it;
  }

  isBlurred = injectBlurSetting().isBlurred;
}

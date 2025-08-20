import {ChangeDetectionStrategy, Component, Input, numberAttribute} from '@angular/core';

import {APIType} from '../../../api';
import {injectBlurSetting} from '../../../services/blur-setting.service';

@Component({
  selector: 'app-sum-statistics',
  templateUrl: './sum-statistics.component.html',
  styleUrl: './sum-statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SumStatisticsComponent {
  @Input()
  chartType: 'PIE' | 'BAR' | 'TEXT' = 'BAR';

  @Input()
  sumDtos?: APIType['StatisticsSumResponse'][];

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

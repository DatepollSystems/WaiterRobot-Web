import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  template: '<router-outlet/>',
  selector: 'app-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {}

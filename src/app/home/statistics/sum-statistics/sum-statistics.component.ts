import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {AComponent} from 'dfx-helper';

@Component({
  selector: 'app-sum-statistics',
  templateUrl: './sum-statistics.component.html',
  styleUrls: ['./sum-statistics.component.scss'],
})
export class SumStatisticsComponent extends AComponent {
  constructor(public route: ActivatedRoute) {
    super();
  }
}

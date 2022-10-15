import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {Component, Input} from '@angular/core';
import {Thread} from 'dfx-helper';

@Component({
  selector: 'app-statistics-count-card',
  templateUrl: './statistics-count-card.component.html',
  styleUrls: ['./statistics-count-card.component.scss'],
})
export class StatisticsCountCardComponent {
  @Input() set count(it: NumberInput) {
    this._count = coerceNumberProperty(it);
    this.click().then();
  }
  _count = 0;

  countS = '0';

  async click() {
    await this.countUp(this.validateFactor(this._count), this._count);
  }

  validateFactor(max: number): number {
    if (max > 4000) {
      return 24;
    } else if (max > 1000) {
      return 19;
    } else if (max > 500) {
      return 6;
    } else {
      return 1;
    }
  }

  async countUp(factor: number, max: number) {
    this.countS = '0';
    for (let i = 0; i < max; ) {
      i += factor;
      await Thread.sleep(10);
      this.countS = i.toString();
    }
  }
}

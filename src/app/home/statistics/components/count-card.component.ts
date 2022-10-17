import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {Component, Input} from '@angular/core';
import {Thread} from 'dfx-helper';

@Component({
  template: `
    <div class="card clickable" (click)="click()">
      <div class="card-body text-center d-flex flex-column gap-2">
        <h4><ng-content></ng-content></h4>
        <p class="heading">{{ countS }}<ng-content select="[valuePrefix]"></ng-content></p>
      </div>
    </div>
  `,
  styles: [
    `
      .heading {
        font-size: 3rem;
      }
    `,
  ],
  selector: 'app-statistics-count-card',
})
export class CountCardComponent {
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
      return 18;
    } else if (max > 500) {
      return 6;
    } else {
      return 2;
    }
  }

  async countUp(factor: number, max: number) {
    this.countS = '0';
    for (let i = 0; i < max; ) {
      i += factor;
      let sleep = 10;
      if (i < max - 100) {
        sleep = 10;
      } else if (i < max - 50) {
        sleep = 20;
      } else if (i < max - 20) {
        sleep = 40;
      } else {
        sleep = 60;
      }

      await Thread.sleep(sleep);
      this.countS = i.toString();
    }
  }
}

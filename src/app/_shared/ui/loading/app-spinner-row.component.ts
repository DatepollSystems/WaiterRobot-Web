import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {AppSpinnerComponent} from './app-spinner.component';

@Component({
  template: `
    <div class="b-spinner-row" *ngIf="_show">
      <app-spinner />
    </div>
  `,
  styles: [
    `
      .b-spinner-row {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        margin-bottom: 30px;
      }
    `,
  ],
  selector: 'app-spinner-row',
  imports: [NgIf, AppSpinnerComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSpinnerRowComponent {
  @Input()
  set show(it: BooleanInput) {
    this._show = coerceBooleanProperty(it);
  }

  _show = true;
}

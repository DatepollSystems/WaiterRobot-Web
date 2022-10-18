import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {DfxTranslateModule} from 'dfx-translate';

@Component({
  template: `
    <div class="b-spinner-row" *ngIf="_loading">
      <div class="spinner-border">
        <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
      </div>
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
  imports: [NgIf, DfxTranslateModule],
  standalone: true,
})
export class AppSpinnerRowComponent {
  @Input()
  set loading(it: BooleanInput) {
    this._loading = coerceBooleanProperty(it);
  }

  _loading!: boolean;
}

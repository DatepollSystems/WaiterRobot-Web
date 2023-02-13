import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';

@Component({
  template: `
    <div class="spinner-border" *ngIf="_show">
      <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
    </div>
  `,
  selector: 'app-spinner',
  imports: [NgIf, DfxTranslateModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSpinnerComponent {
  @Input()
  set show(it: BooleanInput) {
    this._show = coerceBooleanProperty(it);
  }

  _show = true;
}

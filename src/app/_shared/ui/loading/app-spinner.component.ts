import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';

@Component({
  template: `
    <div class="spinner-border">
      <span class="visually-hidden">{{ 'LOADING' | tr }}</span>
    </div>
  `,
  selector: 'app-spinner',
  imports: [DfxTranslateModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSpinnerComponent {}

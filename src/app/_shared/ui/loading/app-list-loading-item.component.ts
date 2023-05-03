import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DfxTr} from 'dfx-translate';
import {AppSpinnerComponent} from './app-spinner.component';

@Component({
  template: `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <strong>{{ 'LOADING' | tr }}</strong>
      <app-spinner />
    </div>
  `,
  standalone: true,
  selector: 'app-list-loading-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppSpinnerComponent, DfxTr],
})
export class AppListLoadingItemComponent {}

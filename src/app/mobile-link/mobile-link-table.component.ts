import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <p class="card-text">Coming soon...</p>
    <div class="mt-3">
      <a href="/home" class="btn btn-light btn-sm">{{ 'GO_BACK' | tr }}</a>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-link-table',
  imports: [DfxTr],
})
export class MobileLinkTableComponent {}

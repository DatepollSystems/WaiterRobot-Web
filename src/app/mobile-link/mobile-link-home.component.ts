import {ChangeDetectionStrategy, Component} from '@angular/core';

import {DfxTr} from 'dfx-translate';

import {AppDownloadBtnListComponent} from '../_shared/ui/button/app-download-btn-list.component';

@Component({
  template: `
    <p class="card-text">
      {{ 'MOBILE_LINK' | tr }}
    </p>
    <app-download-btn-list [showQRCodeButton]="false" />
    <div class="mt-3">
      <a href="/home" class="btn btn-light btn-sm">{{ 'GO_BACK' | tr }}</a>
    </div>
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDownloadBtnListComponent, DfxTr],
})
export class MobileLinkHomeComponent {}

import {Component} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';

import {AppDownloadBtnListModule} from '../_shared/ui/download-btn-list/app-download-btn-list.module';

@Component({
  template: `
    <p class="card-text">
      {{ 'MOBILE_LINK' | tr }}
    </p>
    <app-download-btn-list [showQRCodeButton]="false"></app-download-btn-list>
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  imports: [AppDownloadBtnListModule, DfxTranslateModule],
})
export class MobileLinkHomeComponent {}

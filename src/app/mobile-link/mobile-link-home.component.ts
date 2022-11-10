import {Component} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListComponent} from '../_shared/ui/app-download-btn-list.component';

@Component({
  template: `
    <p class="card-text">
      {{ 'MOBILE_LINK' | tr }}
    </p>
    <app-download-btn-list [showQRCodeButton]="false"></app-download-btn-list>
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  imports: [AppDownloadBtnListComponent, DfxTranslateModule],
})
export class MobileLinkHomeComponent {}

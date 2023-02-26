import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListComponent} from '../_shared/ui/app-download-btn-list.component';

@Component({
  template: `
    <p class="card-text">
      {{ 'MOBILE_LINK' | tr }}
    </p>
    <app-download-btn-list [showQRCodeButton]="false" />
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDownloadBtnListComponent, DfxTranslateModule],
})
export class MobileLinkHomeComponent {}

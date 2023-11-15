import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {DfxTr} from 'dfx-translate';

import {AppDownloadBtnListComponent} from '../_shared/ui/button/app-download-btn-list.component';

@Component({
  template: `
    <h1 class="fs-3">App Link</h1>
    <p>{{ 'MOBILE_LINK' | tr }}</p>
    <app-download-btn-list [showQRCodeButton]="false" />
    <div class="mt-3">
      <a routerLink="/" class="btn btn-light btn-sm w-100">{{ 'GO_BACK' | tr }}</a>
    </div>
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDownloadBtnListComponent, DfxTr, RouterLink],
})
export class MobileLinkHomeComponent {}

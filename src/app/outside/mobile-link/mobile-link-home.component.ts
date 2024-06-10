import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';

import {AppDownloadBtnListComponent} from '@shared/ui/app-download-btn-list.component';

@Component({
  template: `
    <h1 class="fs-3">App Link</h1>
    <p>{{ 'MOBILE_LINK' | transloco }}</p>
    <app-download-btn-list [showQRCodeButton]="false" />
    <div class="mt-3">
      <a routerLink="/" class="btn btn-light btn-sm w-100">{{ 'GO_BACK' | transloco }}</a>
    </div>
  `,
  standalone: true,
  selector: 'app-mobile-link-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDownloadBtnListComponent, TranslocoPipe, RouterLink],
})
export class MobileLinkHomeComponent {}

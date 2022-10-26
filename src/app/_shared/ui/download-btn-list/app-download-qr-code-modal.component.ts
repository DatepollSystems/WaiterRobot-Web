import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {appDownload} from './app-download-btn-list.component';

@Component({
  template: `
    <app-qrcode-modal [data]="appLink?.link" [showPrintButton]="false">
      <h4 class="modal-title" id="app-download-modal-title">{{ 'ABOUT_APP_QR_CODE_MODAL_TITLE' | tr }} {{ appLink?.text }}</h4>
    </app-qrcode-modal>
  `,
  selector: 'app-download-qrcode-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDownloadQrCodeModalComponent {
  @Input() appLink: appDownload | undefined;
}

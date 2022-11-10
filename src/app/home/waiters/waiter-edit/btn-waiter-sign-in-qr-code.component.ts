import {Component, Input} from '@angular/core';

import {MobileLinkService} from '../../../_shared/services/mobile-link.service';

@Component({
  selector: 'app-btn-waiter-signin-qrcode',
  template: `
    <app-btn-qrcode [data]="_token">
      <span *appBtnQrCodeContent>{{ 'HOME_WAITERS_EDIT_QR_CODE' | tr }}</span>
      <ng-container info>
        {{ 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION' | tr }}
      </ng-container>
    </app-btn-qrcode>
  `,
})
export class BtnWaiterSignInQrCodeComponent {
  _token: string | undefined;

  constructor(private mobileLink: MobileLinkService) {}

  @Input()
  set token(token: string) {
    this._token = this.mobileLink.createWaiterSignInLink(token);
  }
}

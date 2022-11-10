import {Component, Input} from '@angular/core';

import {MobileLinkService} from '../../../_shared/services/mobile-link.service';

@Component({
  selector: 'app-btn-waiter-signin-qrcode',
  template: `
    <app-btn-qrcode [data]="_token" text="HOME_WAITERS_EDIT_QR_CODE" info="HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION"></app-btn-qrcode>
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

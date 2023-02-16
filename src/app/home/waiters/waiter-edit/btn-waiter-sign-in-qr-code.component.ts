import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {MobileLinkService} from '../../../_shared/services/mobile-link.service';
import {AppBtnQrCodeComponent} from '../../../_shared/ui/qr-code/app-btn-qr-code.component';

@Component({
  template: `
    <app-btn-qrcode [data]="_token" text="HOME_WAITERS_EDIT_QR_CODE" info="HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION"></app-btn-qrcode>
  `,
  selector: 'app-btn-waiter-signin-qrcode',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBtnQrCodeComponent],
})
export class BtnWaiterSignInQrCodeComponent {
  _token: string | undefined;

  constructor(private mobileLink: MobileLinkService) {}

  @Input()
  set token(token: string) {
    this._token = this.mobileLink.createWaiterSignInLink(token);
  }
}

import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {AppQrCodeButtonComponent} from '../_shared/components/button/app-qr-code-button.component';
import {MobileLinkService} from '../_shared/services/mobile-link.service';

@Component({
  template: ' <app-qrcode-button text="HOME_WAITERS_EDIT_QR_CODE" info="HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION" [data]="_token" /> ',
  selector: 'app-btn-waiter-signin-qrcode',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppQrCodeButtonComponent],
})
export class BtnWaiterSignInQrCodeComponent {
  _token: string | undefined;

  #mobileLink = inject(MobileLinkService);

  @Input()
  set token(token: string) {
    this._token = this.#mobileLink.createWaiterSignInLink(token);
  }
}

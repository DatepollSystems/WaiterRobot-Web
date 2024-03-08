import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';

import {MobileLinkService} from '../../services/mobile-link.service';
import {AppQrCodeButtonComponent} from './app-qr-code-button.component';

@Component({
  selector: 'app-waiter-create-qrcode-btn',
  template: `
    <app-qrcode-button text="HOME_WAITERS_EVENT_CREATE_QR_CODE" info="HOME_WAITERS_EDIT_EVENTS_QR_CODE_DESCRIPTION" [data]="_token" />
  `,
  imports: [AppQrCodeButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnWaiterCreateQrCodeComponent {
  #mobileLink = inject(MobileLinkService);

  @Input()
  set token(token: string) {
    this._token = this.#mobileLink.createWaiterSignInViaCreateTokenLink(token);
  }

  _token: string | undefined;
}

import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {ShareableLinkPipe, WaiterAuthLinkPipe} from '../pipes/wr-links.pipe';
import {AppQrCodeButtonComponent} from './button/app-qr-code-button.component';

@Component({
  template: `
    <app-qrcode-button
      [data]="'ml' | shareableLink | waiterAuthLink: 'SIGN_IN' : token()"
      text="HOME_WAITERS_EDIT_QR_CODE"
      info="HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION"
    />
  `,
  selector: 'app-btn-waiter-signin-qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShareableLinkPipe, WaiterAuthLinkPipe, AppQrCodeButtonComponent],
})
export class BtnWaiterSignInQrCodeComponent {
  token = input.required<string>();
}

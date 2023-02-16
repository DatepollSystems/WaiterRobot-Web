import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MobileLinkService} from '../../../_shared/services/mobile-link.service';
import {AppBtnQrCodeComponent} from '../../../_shared/ui/qr-code/app-btn-qr-code.component';

@Component({
  selector: 'app-btn-waiter-create-qrcode',
  template: `
    <app-btn-qrcode
      [data]="_token"
      text="HOME_WAITERS_EVENT_CREATE_QR_CODE"
      info="HOME_WAITERS_EDIT_EVENTS_QR_CODE_DESCRIPTION"></app-btn-qrcode>
  `,
  imports: [AppBtnQrCodeComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnWaiterCreateQrCodeComponent {
  @Input()
  set token(token: string) {
    this._token = this.mobileLink.createWaiterSignInViaCreateTokenLink(token);
  }

  _token: string | undefined;

  constructor(private mobileLink: MobileLinkService) {}
}

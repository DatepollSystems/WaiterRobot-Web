import {Component, Input} from '@angular/core';

import {MobileLinkService} from '../../../_services/mobile-link.service';

@Component({
  selector: 'app-waiter-signin-qrcode-modal',
  template: `
    <app-qrcode-modal [data]="_token">
      <h4 class="modal-title" id="modal-qrcode-title" header>{{ 'HOME_WAITERS_SHOW_QR_CODE' | tr }} {{ name }}</h4>
      <div body fxLayout="row" fxLayoutAlign="center">
        <div class="card text-dark bg-light mb-3" fxFlex.gt-sm="80%">
          <div class="card-body">
            <h5 class="card-title">{{ 'INFORMATION' | tr }}</h5>
            <p class="card-text">{{ 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION' | tr }}</p>
          </div>
        </div>
      </div>
    </app-qrcode-modal>
  `,
})
export class WaiterSignInQRCodeModalComponent {
  @Input() name = '';
  _token: string | undefined;

  constructor(private mobileLink: MobileLinkService) {}

  @Input()
  set token(token: string) {
    this._token = this.mobileLink.createWaiterSignInLink(token);
  }
}

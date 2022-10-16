import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-email-qrcode-modal',
  template: `
    <app-qrcode-modal [data]="token" [showPrintButton]="false">
      <h4 class="modal-title" id="modal-user-email-qrcode-title" header>{{ name }}</h4>
      <div body>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ 'INFORMATION' | tr }}</h5>
            <p class="card-text">{{ 'NAV_USER_SETTINGS_QR_CODE_INFO' | tr }}</p>
          </div>
        </div>
      </div>
    </app-qrcode-modal>
  `,
})
export class UserEmailQRCodeModalComponent {
  @Input() name = '';
  @Input() token = '';
}

import {Component, Input} from '@angular/core';

import {QrCodeModel} from '../../_shared/app-qr-code-modal/qr-code.model';

@Component({
  selector: 'app-waiter-qrcode-modal',
  template: `
    <app-qrcode-modal [data]="qrCodeModel?.toString()">
      <h4 class="modal-title" id="modal-qrcode-title" header>{{ 'HOME_WAITERS_SHOW_QR_CODE' | tr }} {{ name }}</h4>
      <div body fxLayout="row" fxLayoutAlign="center" *ngIf="qrCodeModel">
        <div class="card text-dark bg-light mb-3" fxFlex.gt-sm="50%">
          <div class="card-body">
            <h5 class="card-title">{{ 'INFORMATION' | tr }}</h5>
            <p class="card-text" *ngIf="qrCodeModel?.purpose === 'WAITER_CREATE'">
              {{ 'HOME_WAITERS_EDIT_EVENTS_QR_CODE_DESCRIPTION' | tr }}
            </p>
            <p class="card-text" *ngIf="qrCodeModel?.purpose === 'WAITER_SIGN_IN'">{{ 'HOME_WAITERS_EDIT_QR_CODE_DESCRIPTION' | tr }}</p>
          </div>
        </div>
      </div>
    </app-qrcode-modal>
  `,
})
export class WaiterQRCodeModalComponent {
  @Input() qrCodeModel: QrCodeModel | undefined;
  @Input() name: string = '';
}

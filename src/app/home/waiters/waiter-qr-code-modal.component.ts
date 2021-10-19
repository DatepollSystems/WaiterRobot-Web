import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IsMobileService} from 'dfx-helper';

import {WaiterModel} from '../../_models/waiter.model';

@Component({
  selector: 'app-waiter-qrcode-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-qrcode-title">{{ 'HOME_WAITERS_SHOW_QR_CODE' | tr }} "{{ waiter?.name }}"</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body" fxLayout="row" fxLayoutAlign="center">
      <qr-code
        [value]="waiter?.token"
        [size]="isMobile ? '340' : '700'"
        errorCorrectionLevel="H"
        [margin]="1"
        centerImageSrc="./assets/logo.png"
        [centerImageSize]="isMobile ? '50' : '100'">
      </qr-code>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
})
export class WaiterQRCodeModalComponent {
  @Input() waiter: WaiterModel | undefined;
  isMobile = false;

  constructor(public activeModal: NgbActiveModal, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
  }
}

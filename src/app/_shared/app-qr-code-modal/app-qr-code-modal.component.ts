import {Component, Input} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IsMobileService} from 'dfx-helper';

@Component({
  selector: 'app-qrcode-modal',
  template: `
    <div class="modal-header">
      <ng-content></ng-content>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body" fxLayout="row" fxLayoutAlign="center">
      <qr-code [value]="data" [size]="isMobile ? '340' : '700'" errorCorrectionLevel="H" [margin]="1"> </qr-code>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
})
export class AppQrCodeModalComponent {
  @Input() data: string | undefined;
  @Input() showLogo = false;

  isMobile = false;

  constructor(public activeModal: NgbActiveModal, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
  }
}

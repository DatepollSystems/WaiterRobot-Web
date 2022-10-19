import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {DfxTranslateModule} from 'dfx-translate';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-qrcode-scanner-title">{{ 'QR_CODE_SCAN' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <zxing-scanner (scanSuccess)="scanSuccess($event)"></zxing-scanner>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  selector: 'app-qrcode-scanner-modal',
  standalone: true,
  imports: [DfxTranslateModule, ZXingScannerModule],
})
export class AppQrCodeScannerModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  scanSuccess(scanResult: any): void {
    this.activeModal.close(scanResult);
  }
}

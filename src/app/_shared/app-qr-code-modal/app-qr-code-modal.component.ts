import {Component, Input} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper} from 'dfx-helper';
import {NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qrcode-modal',
  template: `
    <div class="modal-header">
      <ng-content select="[header]"></ng-content>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body p-0" fxLayout="row" fxLayoutAlign="center center">
      <div class="card text-dark text-center bg-light m-0 rounded-0" fxFlex="100">
        <div class="card-body" id="qrcode-print-section" fxLayout="column" fxLayoutAlign="center center">
          <app-qr-code-view [correctionLevel]="correctionLevel" [data]="data"></app-qr-code-view>
          <div style="height: 15px"></div>
          <ng-content select="[body]"></ng-content>
        </div>
        <div class="card-footer text-muted font-monospace text-break bg-transparent rounded-0 border-bottom-0 pt-4 pb-3">
          {{ data }}
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary ms-2" (click)="copy()">
              {{ 'COPY' | tr }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary ms-2"
              *ngIf="showPrintButton"
              printSectionId="qrcode-print-section"
              ngxPrint
              [printTitle]="printTitle"
              [printStyle]="{'.qrcode': {'margin-left': '28%', 'margin-bottom': '50px', 'margin-top': '150px'}}">
              {{ 'PRINT' | tr }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
})
export class AppQrCodeModalComponent {
  @Input() data: string | undefined;
  @Input() printTitle = 'QR-Code';
  @Input() showPrintButton = true;

  @Input() correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  constructor(public activeModal: NgbActiveModal) {}

  copy(): void {
    if (this.data) {
      ClipboardHelper.copy(this.data);
    }
  }
}

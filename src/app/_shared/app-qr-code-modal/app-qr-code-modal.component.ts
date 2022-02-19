import {Component, Input} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper, IsMobileService} from 'dfx-helper';
import {NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qrcode-modal',
  template: `
    <div class="modal-header">
      <ng-content select="[header]"></ng-content>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body" fxLayout="column" fxLayoutAlign="center center">
      <div class="card text-dark text-center bg-light mb-3" fxFlex.gt-sm="50%" fxFlex="80%">
        <div class="card-body" id="qrcode-print-section" fxLayout="column" fxLayoutAlign="center center">
          <ngx-qrcode *ngIf="data" [scale]="isMobile ? 7 : 10" [errorCorrectionLevel]="correctionLevel" [margin]="0" [value]="data">
          </ngx-qrcode>
          <div style="height: 15px"></div>
          <ng-content select="[body]"></ng-content>
        </div>
        <div class="card-footer text-muted font-monospace text-break">
          {{ data }}
          <button class="btn btn-sm btn-outline-primary ms-2" (click)="copy()">
            {{ 'COPY' | tr }}
          </button>
          <button
            class="btn btn-sm btn-outline-secondary ms-2"
            *ngIf="showPrintButton"
            printSectionId="qrcode-print-section"
            ngxPrint
            [useExistingCss]="true"
            [printTitle]="printTitle"
            [printStyle]="{'.qrcode': {'margin-left': '14%'}}">
            {{ 'PRINT' | tr }}
          </button>
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

  isMobile = false;

  @Input() correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  constructor(public activeModal: NgbActiveModal, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
  }

  copy(): void {
    if (this.data) {
      ClipboardHelper.copy(this.data);
    }
  }
}

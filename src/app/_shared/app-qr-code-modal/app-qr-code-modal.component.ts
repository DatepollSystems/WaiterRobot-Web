import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper} from 'dfx-helper';

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
          <app-qr-code-view [data]="data"></app-qr-code-view>
          <div style="height: 15px"></div>
          <ng-content select="[body]"></ng-content>
        </div>
        <div class="card-footer text-muted font-monospace text-break bg-transparent rounded-0 border-bottom-0 pt-4 pb-3">
          <span *ngIf="dataType === 'TEXT'">{{ data }}</span>
          <a *ngIf="dataType === 'URL'" [href]="data" rel="noopener" target="_blank">{{ data }}</a>
          <div class="mt-2">
            <button
              class="btn btn-sm btn-outline-primary ms-2"
              (click)="copy(t)"
              ngbTooltip="Copied!"
              placement="left"
              [autoClose]="false"
              triggers="manual"
              #t="ngbTooltip">
              {{ 'COPY' | tr }}
            </button>
            <button
              class="btn btn-sm btn-outline-secondary ms-2"
              *ngIf="showPrintButton"
              printSectionId="qrcode-print-section"
              print
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
  @Input() dataType: 'URL' | 'TEXT' = 'URL';
  @Input() data: string | undefined;
  @Input() printTitle = 'QR-Code';
  @Input() showPrintButton = true;

  constructor(public activeModal: NgbActiveModal) {}

  copy(t: NgbTooltip): void {
    if (this.data) {
      t.open();
      ClipboardHelper.copy(this.data);
      setTimeout(() => {
        t.close();
      }, 1000);
    }
  }
}

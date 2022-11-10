import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {NgbActiveModal, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ClipboardHelper, DfxCutPipe, DfxPrintDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeViewComponent} from './app-qr-code-view.component';
import {CopyDirective} from '../copy.directive';
import {AppBtnToolbarComponent} from '../app-btn-toolbar.component';

@Component({
  template: `
    <div class="modal-header">
      <ng-content select="[header]"></ng-content>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="d-flex flex-column align-items-center" id="qrcode-print-section">
        <div class="col">
          <app-qr-code-view [data]="data"></app-qr-code-view>
        </div>
        <div class="col-11 col-md-10 col-lg-7 mt-3">
          <ng-content select="[body]"></ng-content>
        </div>
      </div>

      <hr />

      <div class="d-flex flex-column align-items-center text-muted font-monospace text-break pt-4 pb-3 gap-2">
        <span class="col" *ngIf="dataType === 'TEXT'">{{ data | cut: 43:'..' }}</span>
        <div class="col text-center">
          <a *ngIf="dataType === 'URL'" [href]="data" rel="noopener" target="_blank">{{ data | cut: 43:'..' }}</a>
        </div>
        <div class="col">
          <btn-toolbar>
            <button
              [copyable]="data"
              #c="copy"
              class="btn btn-sm btn-primary ms-2"
              (click)="c.copy(t)"
              ngbTooltip="{{ 'COPIED' | tr }}"
              #t="ngbTooltip"
              autoClose="false"
              triggers="manual"
              placement="left">
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
          </btn-toolbar>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" ngbAutofocus (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  selector: 'app-qrcode-modal',
  standalone: true,
  imports: [
    NgIf,
    DfxTranslateModule,
    DfxPrintDirective,
    DfxCutPipe,
    NgbTooltipModule,
    AppQrCodeViewComponent,
    CopyDirective,
    AppBtnToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

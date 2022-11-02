import {NgForOf, NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {Converter, DateHelper, DfxPrintDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';

import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {IconsModule} from '../../../_shared/ui/icons.module';
import {TableModel} from '../_models/table.model';
import {MobileLinkService} from '../../../_shared/services/mobile-link.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="app-tables-qr-codes-title">{{ 'QRCODE' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-primary" (click)="pdf()" [class.spinner]="generating" [disabled]="generating">
            <i-bs name="printer"></i-bs>
            {{ 'Generate PDF' | tr }}
          </button>
        </div>

        <div ngbDropdown class="d-inline-block">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="qrCodeSizeDropdown" ngbDropdownToggle [disabled]="generating">
            Size: {{ qrCodeSize === 'SM' ? 'Small' : 'Middle' }}
          </button>
          <div ngbDropdownMenu aria-labelledby="qrCodeSizeDropdown">
            <button ngbDropdownItem (click)="qrCodeSize = 'SM'">Small</button>
            <button ngbDropdownItem (click)="qrCodeSize = 'MD'">Middle</button>
          </div>
        </div>
      </btn-toolbar>

      <div class="alert alert-info" role="alert" *ngIf="generating"><strong>Attention!</strong> Please do not close this window.</div>

      <div class="main">
        <div class="d-flex flex-wrap justify-content-center">
          <div *ngFor="let mytable of tables" class="qr-code-list">
            <qrcode
              [width]="getQrCodeSize()"
              errorCorrectionLevel="Q"
              [margin]="0"
              [qrdata]="parser(mytable)"
              cssClass="text-center"
              elementType="canvas"></qrcode>

            <div class="text-center text-black">
              <span
                >Nr: <b>{{ mytable.tableNumber }}</b></span
              >&nbsp;
              <span
                >Gr: <b>{{ mytable.groupName }}</b></span
              >

              <div>
                <small><u>https://kellner.team</u></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
    </div>
  `,
  styles: [
    `
      .main {
        background-color: #ffffff;
      }

      .qr-code-list {
        border-style: dashed;
        border-color: #ccc;
        border-width: 1px;
        padding: 31px 31px 20px 31px;
      }
    `,
  ],
  selector: 'app-print-table-qr-codes-modal',
  standalone: true,
  imports: [DfxPrintDirective, QRCodeModule, NgForOf, DfxTranslateModule, AppBtnToolbarComponent, IconsModule, NgbDropdownModule, NgIf],
})
export class AppPrintTableQrCodesModalComponent {
  @Input() tables?: TableModel[];

  qrCodeSize: 'SM' | 'MD' = 'MD';
  generating = false;

  constructor(public activeModal: NgbActiveModal, private mobileLink: MobileLinkService) {}

  parser = (table: TableModel): string => {
    return this.mobileLink.createTableLink(Converter.toString(table.id));
  };

  async pdf(): Promise<void> {
    this.generating = true;

    const qrCodeDivs = document.getElementsByClassName('qr-code-list');
    const pdf = new jsPDF('p', 'pt', 'a4', true);

    const width = this.getQrCodeSize() + 31;

    let x = 0;
    let y = 0;

    for (let i = 0; i < qrCodeDivs.length; i++) {
      const qrcode = qrCodeDivs.item(i);
      if (qrcode) {
        const canvas = await html2canvas(qrcode as HTMLElement, {scale: 2});
        const FILEURI = canvas.toDataURL('image/jpeg', 0.5);
        pdf.addImage(FILEURI, 'JPEG', x, y, width, width + 35);
        x += width;
      }
      if (x > 500) {
        x = 0;
        y += width + 30;
      }
      if (y > 600) {
        pdf.addPage();
        x = 0;
        y = 0;
      }
    }
    pdf.save(`tables-${DateHelper.getFormattedWithHoursMinutesAndSeconds(new Date()) ?? ''}.pdf`);
    this.generating = false;
  }

  getQrCodeSize = () => {
    switch (this.qrCodeSize) {
      case 'SM':
        return 118;
      case 'MD':
        return 167;
      default:
        throw Error('Uknown qr code size');
    }
  };
}

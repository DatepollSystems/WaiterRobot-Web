import {NgForOf, NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {Converter, DateHelper, DfxPrintDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';

import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {TableModel} from '../_models/table.model';
import {MobileLinkService} from '../../../_shared/services/mobile-link.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="app-tables-qr-codes-title">{{ 'HOME_TABLE_PRINT_TITLE' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <btn-toolbar>
        <div>
          <button class="btn btn-sm btn-primary" (click)="pdf()" [class.spinner]="generating" [disabled]="generating">
            <i-bs name="printer"></i-bs>
            {{ 'HOME_TABLE_PRINT_GENERATE' | tr }}
          </button>
        </div>

        <div ngbDropdown class="d-inline-block">
          <button type="button" class="btn btn-sm btn-outline-secondary" id="qrCodeSizeDropdown" ngbDropdownToggle [disabled]="generating">
            {{ 'SIZE' | tr }}: {{ (qrCodeSize === 'SM' ? 'HOME_TABLE_PRINT_SM' : 'HOME_TABLE_PRINT_MD') | tr }}
          </button>
          <div ngbDropdownMenu aria-labelledby="qrCodeSizeDropdown">
            <button ngbDropdownItem (click)="qrCodeSize = 'SM'">{{ 'HOME_TABLE_PRINT_SM' | tr }}</button>
            <button ngbDropdownItem (click)="qrCodeSize = 'MD'">{{ 'HOME_TABLE_PRINT_MD' | tr }}</button>
          </div>
        </div>
      </btn-toolbar>

      <ngb-progressbar
        *ngIf="progress"
        type="primary"
        class="my-2"
        textType="white"
        [value]="progress"
        [showValue]="true"></ngb-progressbar>

      <div class="alert alert-info" role="alert" *ngIf="generating">{{ 'DO_NOT_CLOSE_WINDOW' | tr }}!</div>

      <div class="main">
        <div class="d-flex flex-wrap justify-content-center">
          <div *ngFor="let mytable of tables" class="qr-code-item">
            <qrcode
              [width]="getQrCodeSize()"
              errorCorrectionLevel="Q"
              [margin]="0"
              [qrdata]="parser(mytable)"
              cssClass="text-center"
              elementType="canvas"></qrcode>

            <div class="text-center text-black qr-code-label">
              <b>{{ mytable.groupName }} - {{ mytable.tableNumber }}</b>
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

      .qr-code-item {
        border-style: dashed;
        border-color: #ccc;
        border-width: 1px;
        padding: 15px 31px 15px 31px;
      }

      .qr-code-label {
        font-size: 40px;
      }
    `,
  ],
  selector: 'app-print-table-qr-codes-modal',
  standalone: true,
  imports: [
    DfxPrintDirective,
    QRCodeModule,
    NgForOf,
    DfxTranslateModule,
    AppBtnToolbarComponent,
    AppIconsModule,
    NgbDropdownModule,
    NgIf,
    NgbProgressbarModule,
  ],
})
export class AppPrintTableQrCodesModalComponent {
  @Input() tables?: TableModel[];

  qrCodeSize: 'SM' | 'MD' = 'MD';
  generating = false;
  progress?: number;

  constructor(public activeModal: NgbActiveModal, private mobileLink: MobileLinkService) {}

  parser = (table: TableModel): string => {
    return this.mobileLink.createTableLink(Converter.toString(table.id));
  };

  async pdf(): Promise<void> {
    this.generating = true;
    this.progress = 1;

    const qrCodeDivs = document.getElementsByClassName('qr-code-item');
    const pdf = new jsPDF('p', 'pt', 'a4', true);

    const width = this.getQrCodeSize() + 31;

    let x = 0;
    let y = 0;

    const steps = 100 / qrCodeDivs.length;

    for (let i = 0; i < qrCodeDivs.length; i++) {
      const qrcode = qrCodeDivs.item(i);
      if (qrcode) {
        const canvas = await toJpeg(qrcode as HTMLElement, {quality: 0.7, backgroundColor: '#FFFFFF'});

        pdf.addImage(canvas, 'JPEG', x, y, width, width + this.getQrCodePadding());
        x += width;
      }
      if (x > 500) {
        x = 0;
        y += width + this.getQrCodePadding();
      }
      if (y > 760) {
        // Do not add page if it is the last round of the loop and the last qr code line on a page
        if (i + 1 < qrCodeDivs.length) {
          pdf.addPage();
        }
        x = 0;
        y = 0;
      }
      this.progress += steps;
      console.log(this.progress);
    }
    pdf.save(`tables-${DateHelper.getFormattedWithHoursMinutesAndSeconds(new Date()) ?? ''}.pdf`);
    this.generating = false;
    this.progress = undefined;
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

  getQrCodePadding = () => {
    switch (this.qrCodeSize) {
      case 'SM':
        return 20;
      case 'MD':
        return 13;
      default:
        throw Error('Uknown qr code size');
    }
  };
}

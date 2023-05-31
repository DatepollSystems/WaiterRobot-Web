import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {d_formatWithHoursMinutesAndSeconds, s_from} from 'dfts-helper';
import {DfxTrackByModule} from 'dfx-helper';
import {QRCodeComponent} from 'dfx-qrcode';
import {DfxTranslateModule} from 'dfx-translate';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';
import {MobileLinkService} from '../../_shared/services/mobile-link.service';

import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {GetTableResponse} from '../../_shared/waiterrobot-backend';

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
            <i-bs name="printer" />
            {{ 'HOME_TABLE_PRINT_GENERATE' | tr }}
          </button>
        </div>

        <div class="btn-group flex-wrap" role="group" aria-label="QRCode size">
          <button type="button" class="btn btn-sm btn-outline-secondary" [class.active]="qrCodeSize === 'SM'" (click)="qrCodeSize = 'SM'">
            {{ 'HOME_TABLE_PRINT_SM' | tr }}
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" [class.active]="qrCodeSize === 'MD'" (click)="qrCodeSize = 'MD'">
            {{ 'HOME_TABLE_PRINT_MD' | tr }}
          </button>
        </div>
      </btn-toolbar>

      <ngb-progressbar
        *ngIf="progress"
        type="primary"
        class="my-2"
        textType="white"
        [value]="progress"
        [showValue]="true"
      ></ngb-progressbar>

      <div class="alert alert-info mb-2" role="alert">Deaktiviere mögliche Seitenränder beim drucken.</div>

      <div class="alert alert-info" role="alert" *ngIf="generating">{{ 'DO_NOT_CLOSE_WINDOW' | tr }}!</div>

      <div class="main">
        <div class="d-flex flex-wrap justify-content-center">
          <div *ngFor="let mytable of tables; trackById" class="qr-code-item">
            <qrcode
              [imageSrc]="qrCodeSize === 'MD' ? '/assets/mono.png' : undefined"
              [imageWidth]="60"
              [imageHeight]="60"
              [size]="8"
              [errorCorrectionLevel]="qrCodeSize === 'MD' ? 'H' : 'M'"
              [margin]="0"
              [data]="parser(mytable)"
              cssClass="text-center"
              elementType="canvas"
            />

            <div class="text-center text-black qr-code-label">
              <b>{{ mytable.groupName }} - {{ mytable.number }}</b>
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
        padding: 25px 31px 15px 31px;
      }

      .qr-code-label {
        font-size: 40px;
      }
    `,
  ],
  selector: 'app-print-table-qr-codes-modal',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgbProgressbarModule,
    DfxTranslateModule,
    DfxTrackByModule,
    QRCodeComponent,
    AppBtnToolbarComponent,
    AppIconsModule,
    NgbDropdownModule,
    AsyncPipe,
  ],
})
export class PrintTableQrCodesModalComponent {
  @Input() tables?: GetTableResponse[];

  qrCodeSize: 'SM' | 'MD' = 'MD';
  generating = false;
  progress?: number;

  constructor(public activeModal: NgbActiveModal, private mobileLink: MobileLinkService) {}

  parser = (table: GetTableResponse): string => {
    return this.mobileLink.createTableLink(s_from(table.id));
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
    pdf.save(`tables-${d_formatWithHoursMinutesAndSeconds(new Date()) ?? ''}.pdf`);
    this.generating = false;
    this.progress = undefined;
  }

  getQrCodeSize = (): number => {
    switch (this.qrCodeSize) {
      case 'SM':
        return 118;
      case 'MD':
        return 167;
      default:
        throw Error('Uknown qr code size');
    }
  };

  getQrCodePadding = (): number => {
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

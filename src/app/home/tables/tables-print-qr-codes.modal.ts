import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';

import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {MobileLinkService} from '@home-shared/services/mobile-link.service';
import {NgbActiveModal, NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {d_formatWithHoursMinutesAndSeconds} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {QRCodeComponent} from 'dfx-qrcode';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';
import {delay, of} from 'rxjs';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="app-tables-qr-codes-title">{{ 'HOME_TABLE_PRINT_TITLE' | transloco }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (mousedown)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body d-flex flex-column gap-3">
      <scrollable-toolbar>
        <div>
          <button type="button" class="btn btn-sm btn-primary" [class.btnSpinner]="generating" [disabled]="generating" (click)="pdf()">
            <bi name="printer" />
            {{ 'HOME_TABLE_PRINT_GENERATE' | transloco }}
          </button>
        </div>

        <div class="btn-group flex-wrap" role="group" aria-label="QRCode size">
          <button type="button" class="btn btn-sm btn-outline-secondary" [class.active]="qrCodeSize === 'SM'" (click)="qrCodeSize = 'SM'">
            {{ 'HOME_TABLE_PRINT_SM' | transloco }}
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" [class.active]="qrCodeSize === 'MD'" (click)="qrCodeSize = 'MD'">
            {{ 'HOME_TABLE_PRINT_MD' | transloco }}
          </button>
        </div>
      </scrollable-toolbar>

      @if (progress(); as progress) {
        <ngb-progressbar type="primary" class="my-2" textType="white" [value]="progress" [max]="100" [showValue]="true" />
      }

      <div class="alert alert-info mb-2" role="alert">Deaktiviere mögliche Seitenränder beim drucken.</div>

      @if (generating) {
        <div class="alert alert-info" role="alert">{{ 'DO_NOT_CLOSE_WINDOW' | transloco }}!</div>
      }

      <div class="main">
        <div class="d-flex flex-wrap justify-content-center">
          @for (mytable of tables(); track mytable.id) {
            <div class="qr-code-item">
              <qrcode
                cssClass="text-center"
                elementType="canvas"
                [imageSrc]="qrCodeSize === 'MD' ? '/assets/mono.png' : undefined"
                [imageWidth]="70"
                [imageHeight]="70"
                [size]="8"
                [errorCorrectionLevel]="qrCodeSize === 'MD' ? 'H' : 'M'"
                [margin]="0"
                [data]="parser(mytable)"
              />

              <div class="text-center text-black qr-code-label">
                <b>{{ mytable.group.name }} - {{ mytable.number }}</b>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (mousedown)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
    </div>
  `,
  styles: `
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
      margin-top: -22px;
      margin-bottom: -22px;
      font-size: 5.8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-print-table-qr-codes-modal',
  standalone: true,
  imports: [NgbProgressbarModule, QRCodeComponent, ScrollableToolbarComponent, BiComponent, NgbDropdownModule, AsyncPipe, TranslocoPipe],
})
export class TablesPrintQrCodesModal {
  activeModal = inject(NgbActiveModal);
  #mobileLink = inject(MobileLinkService);

  tables = signal<GetTableWithGroupResponse[]>([]);

  qrCodeSize: 'SM' | 'MD' = 'MD';
  generating = false;
  progress = signal<number | undefined>(undefined);

  parser = (table: GetTableWithGroupResponse): string => {
    return this.#mobileLink.createTableLink(table.publicId);
  };

  async pdf(): Promise<void> {
    this.generating = true;
    this.progress.set(1);

    const qrCodeDivs = document.getElementsByClassName('qr-code-item');
    const pdf = new jsPDF('p', 'pt', 'a4', true);

    const width = this.getQrCodeSize() + 31;

    let x = 0;
    let y = 10;

    const steps = 100 / qrCodeDivs.length;

    for (let i = 0; i < qrCodeDivs.length; i++) {
      const qrcode = qrCodeDivs.item(i);
      if (qrcode) {
        const canvas = await toJpeg(qrcode as HTMLElement, {quality: 0.7, backgroundColor: '#FFFFFF'});

        pdf.addImage(canvas, 'JPEG', x, y, width, width);
        x += width;
      }
      if (x > 500) {
        x = 0;
        y += width;
      }
      if (y > 720) {
        // Do not add page if it is the last round of the loop and the last qr code line on a page
        if (i + 1 < qrCodeDivs.length) {
          pdf.addPage();
        }
        x = 0;
        y = 10;
      }
      this.progress.update((it) => (it ?? 1) + steps);
    }
    pdf.save(`tables-${d_formatWithHoursMinutesAndSeconds(new Date())}.pdf`);
    this.generating = false;

    of(true)
      .pipe(delay(1000))
      .subscribe(() => {
        this.progress.set(undefined);
      });
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

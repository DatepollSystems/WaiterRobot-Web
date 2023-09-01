import {AsyncPipe, Location, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';

import {d_format, s_chunks} from 'dfts-helper';
import {DfxCutPipe, IsMobileService, WINDOW} from 'dfx-helper';
import {QRCodeComponent} from 'dfx-qrcode';
import {DfxTr, dfxTranslate} from 'dfx-translate';

import {qrCodeData, QrCodeService} from '../../services/qr-code.service';
import {AppBtnToolbarComponent} from '../app-btn-toolbar.component';
import {CopyDirective} from '../copy.directive';
import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <div *ngIf="qrCodeData" class="my-container d-flex flex-row flex-wrap gap-5 align-items-center justify-content-center h-100">
      <div id="qrcode" class="qrcode-rounded">
        <qrcode
          [size]="(isMobile$ | async) === true ? 8 : 16"
          errorCorrectionLevel="M"
          [margin]="0"
          colorLight="#f6f6f6"
          [data]="qrCodeData.data"
        ></qrcode>
      </div>
      <div class="card">
        <div class="card-header">
          {{ qrCodeData.text | tr }}
        </div>
        <div class="card-body">
          <p *ngIf="qrCodeData.info.length > 0" id="info-text" class="card-text">{{ qrCodeData.info | tr }}</p>

          <a [href]="qrCodeData.data" target="_blank" rel="noopener">{{ qrCodeData.data | s_cut: 43 : '..' }}</a>
        </div>
        <div class="card-footer text-muted">
          <btn-toolbar padding="false">
            <button class="btn btn-sm btn-secondary" (click)="back()">
              <i-bs name="arrow-left" />
              {{ 'GO_BACK' | tr }}
            </button>

            <button class="btn btn-sm btn-info" (click)="print()">
              <i-bs name="printer" aria-label="Copy content to clipboard" />
              {{ 'PRINT' | tr }}
            </button>

            <button
              class="btn btn-sm btn-primary"
              (click)="c.copy(t)"
              [copyable]="qrCodeData.data"
              #c="copy"
              ngbTooltip="{{ 'COPIED' | tr }}"
              #t="ngbTooltip"
              autoClose="false"
              triggers="manual"
              aria-label="Copy link"
              placement="right"
            >
              <i-bs name="clipboard" aria-label="Copy content to clipboard" />
              {{ 'COPY' | tr }}
            </button>
          </btn-toolbar>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .my-container {
        padding-top: 5rem;
      }

      .qrcode-rounded {
        border-radius: 15px;
        border-width: 5px;
        background-color: #f6f6f6;
        padding: 15px;
        filter: brightness(125%);
      }
    `,
  ],
  selector: 'app-qr-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, QRCodeComponent, NgbTooltipModule, AppIconsModule, AppBtnToolbarComponent, CopyDirective, DfxCutPipe, DfxTr],
})
export class AppQrCodeViewComponent {
  qrCodeData?: qrCodeData;
  isMobile$ = inject(IsMobileService).isMobile$;
  location = inject(Location);

  translate = dfxTranslate();

  constructor(
    qrCodeService: QrCodeService,
    @Inject(WINDOW) private window?: Window,
  ) {
    this.qrCodeData = qrCodeService.getQRCodeData();

    if (!this.qrCodeData) {
      this.back();
    }
  }

  async print(): Promise<void> {
    const qrCode = document.getElementById('qrcode') as HTMLElement;
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    const canvas = await toJpeg(qrCode, {quality: 0.7, backgroundColor: '#FFFFFF'});
    pdf.addImage(canvas, 'JPEG', 70, 20, 450, 450);

    if (this.qrCodeData?.info && this.qrCodeData?.info?.length > 0) {
      const text = await this.translate(this.qrCodeData.info);

      let height = 500;
      for (const chunk of s_chunks(text, 50)) {
        const xOffset = pdf.internal.pageSize.width / 2 - (pdf.getStringUnitWidth(chunk) * pdf.getFontSize()) / 2;
        pdf.text(chunk, xOffset, height);
        height += 20;
      }
    }

    pdf.save(`qrcode-${d_format(new Date())}.pdf`);
  }

  back = (): void => this.location.back();
}

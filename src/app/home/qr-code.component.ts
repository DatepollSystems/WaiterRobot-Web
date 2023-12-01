import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';

import {d_format, s_chunks} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe, injectIsMobile, injectWindow} from 'dfx-helper';
import {QRCodeComponent} from 'dfx-qrcode';
import {DfxTr, dfxTranslate} from 'dfx-translate';

import {CopyDirective} from '../_shared/ui/copy.directive';
import {ScrollableToolbarComponent} from './_shared/components/scrollable-toolbar.component';
import {QrCodeService} from './_shared/services/qr-code.service';

@Component({
  template: `
    @if (qrCodeData(); as data) {
      <div class="my-container d-flex flex-row flex-wrap gap-5 align-items-center justify-content-center h-100">
        <div id="qrcode" class="qrcode-rounded">
          <qrcode [size]="isMobile() ? 8 : 14" errorCorrectionLevel="M" [margin]="0" colorLight="#f6f6f6" [data]="data.data" />
        </div>
        <div class="card">
          <div class="card-header">
            {{ data.text | tr }}
          </div>
          <div class="card-body">
            @if (data.info.length > 0) {
              <p id="info-text" class="card-text">{{ data.info | tr }}</p>
            }

            <a [href]="data.data" target="_blank" rel="noopener" [ngbTooltip]="data.data">{{ data.data | s_cut: 82 : '...' }}</a>
          </div>
          <div class="card-footer text-muted">
            <scrollable-toolbar>
              <button class="btn btn-sm btn-secondary" (click)="back()">
                <bi name="arrow-left" />
                {{ 'GO_BACK' | tr }}
              </button>

              <button class="btn btn-sm btn-info" (click)="print()">
                <bi name="printer" aria-label="Copy content to clipboard" />
                {{ 'PRINT' | tr }}
              </button>

              <button
                class="btn btn-sm btn-primary"
                (click)="c.copy(t)"
                [copyable]="data.data"
                #c="copy"
                ngbTooltip="{{ 'COPIED' | tr }}"
                #t="ngbTooltip"
                autoClose="false"
                triggers="manual"
                aria-label="Copy link"
                placement="right"
              >
                <bi name="clipboard" aria-label="Copy content to clipboard" />
                {{ 'COPY' | tr }}
              </button>
            </scrollable-toolbar>
          </div>
        </div>
      </div>
    }
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
  imports: [QRCodeComponent, NgbTooltipModule, BiComponent, ScrollableToolbarComponent, CopyDirective, DfxCutPipe, DfxTr],
})
export class AppQrCodeViewComponent {
  qrCodeData = inject(QrCodeService).data;
  window = injectWindow();
  isMobile = injectIsMobile();
  location = inject(Location);

  translate = dfxTranslate();

  constructor() {
    effect(() => {
      if (!this.qrCodeData()) {
        this.back();
      }
    });
  }

  async print(): Promise<void> {
    const qrCode = document.getElementById('qrcode') as HTMLElement;
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    const canvas = await toJpeg(qrCode, {quality: 0.7, backgroundColor: '#FFFFFF'});
    pdf.addImage(canvas, 'JPEG', 70, 20, 450, 450);

    const info = this.qrCodeData()?.info;
    if (info && info.length > 0) {
      const text = await this.translate(info);

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

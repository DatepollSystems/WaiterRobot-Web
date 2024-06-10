import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe, TranslocoService} from '@ngneat/transloco';
import {CopyDirective} from '@shared/ui/copy.directive';

import {d_format, s_chunks} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe, injectIsMobile, injectWindow} from 'dfx-helper';
import {QRCodeComponent} from 'dfx-qrcode';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';

import {ScrollableToolbarComponent} from './_shared/components/scrollable-toolbar.component';
import {QrCodeService} from './_shared/services/qr-code.service';

@Component({
  template: `
    @if (qrCodeData(); as data) {
      <div class="my-container d-flex flex-row flex-wrap gap-5 align-items-center justify-content-center h-100">
        <div id="qrcode" class="qrcode-rounded">
          <qrcode errorCorrectionLevel="M" colorLight="#f6f6f6" [size]="isMobile() ? 8 : 14" [margin]="0" [data]="data.data" />
        </div>
        <div class="card">
          <div class="card-header">
            {{ data.text | transloco }}
          </div>
          <div class="card-body">
            @if (data.info.length > 0) {
              <p id="info-text" class="card-text">{{ data.info | transloco }}</p>
            }

            <a target="_blank" rel="noreferrer" [href]="data.data" [ngbTooltip]="data.data">{{ data.data | s_cut: 82 : '...' }}</a>
          </div>
          <div class="card-footer text-muted">
            <scrollable-toolbar>
              <button type="button" class="btn btn-sm btn-secondary" (mousedown)="back()">
                <bi name="arrow-left" />
                {{ 'GO_BACK' | transloco }}
              </button>

              <button type="button" class="btn btn-sm btn-info" (click)="print()">
                <bi name="printer" aria-label="Copy content to clipboard" />
                {{ 'PRINT' | transloco }}
              </button>

              <button
                #c="copy"
                #t="ngbTooltip"
                type="button"
                class="btn btn-sm btn-primary"
                autoClose="false"
                triggers="manual"
                aria-label="Copy link"
                placement="right"
                [copyable]="data.data"
                [ngbTooltip]="'COPIED' | transloco"
                (click)="c.copy(t)"
              >
                <bi name="clipboard" aria-label="Copy content to clipboard" />
                {{ 'COPY' | transloco }}
              </button>
            </scrollable-toolbar>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
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
  selector: 'app-qr-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QRCodeComponent, NgbTooltipModule, BiComponent, ScrollableToolbarComponent, CopyDirective, DfxCutPipe, TranslocoPipe],
})
export class AppQrCodeViewComponent {
  qrCodeData = inject(QrCodeService).data;
  window = injectWindow();
  isMobile = injectIsMobile();
  location = inject(Location);

  translocoService = inject(TranslocoService);

  constructor() {
    effect(() => {
      if (!this.qrCodeData()) {
        this.back();
      }
    });
  }

  async print(): Promise<void> {
    const qrCode = document.getElementById('qrcode')!;
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    const canvas = await toJpeg(qrCode, {quality: 0.7, backgroundColor: '#FFFFFF'});
    pdf.addImage(canvas, 'JPEG', 70, 20, 450, 450);

    const info = this.qrCodeData()?.info;
    if (info && info.length > 0) {
      const text = this.translocoService.translate(info);

      let height = 500;
      for (const chunk of s_chunks(text, 50)) {
        const xOffset = pdf.internal.pageSize.width / 2 - (pdf.getStringUnitWidth(chunk) * pdf.getFontSize()) / 2;
        pdf.text(chunk, xOffset, height);
        height += 20;
      }
    }

    pdf.save(`qrcode-${d_format(new Date())}.pdf`);
  }

  back = (): void => {
    this.location.back();
  };
}

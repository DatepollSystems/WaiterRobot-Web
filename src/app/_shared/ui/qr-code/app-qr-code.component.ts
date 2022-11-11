import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {AComponent, DateHelper, DfxCutPipe, IsMobileService} from 'dfx-helper';
import {DfxTranslateModule, TranslateService} from 'dfx-translate';
import {toJpeg} from 'html-to-image';
import {jsPDF} from 'jspdf';
import {Subject} from 'rxjs';
import {qrCodeData, QrCodeService} from '../../services/qr-code.service';

import {WINDOW} from '../../services/windows-provider';
import {AppBtnToolbarComponent} from '../app-btn-toolbar.component';
import {CopyDirective} from '../copy.directive';
import {AppIconsModule} from '../icons.module';

@Component({
  template: `
    <div *ngIf="qrCodeData" class="my-container d-flex flex-row flex-wrap gap-5 align-items-center justify-content-center h-100">
      <div id="qrcode" class="qrcode-rounded">
        <qrcode
          [width]="($isMobile | async) ? 300 : 600"
          errorCorrectionLevel="M"
          [margin]="0"
          colorLight="#f6f6f6"
          [qrdata]="qrCodeData.data"></qrcode>
      </div>
      <div class="card">
        <div class="card-header">
          {{ qrCodeData.text | tr }}
        </div>
        <div class="card-body">
          <p *ngIf="qrCodeData.info.length > 0" id="info-text" class="card-text">{{ qrCodeData.info | tr }}</p>

          <a [href]="qrCodeData.data" target="_blank" rel="noopener">{{ qrCodeData.data | cut: 43:'..' }}</a>
        </div>
        <div class="card-footer text-muted">
          <btn-toolbar padding="false">
            <button class="btn btn-sm btn-secondary" (click)="close()">
              <i-bs name="arrow-left"></i-bs>
              {{ 'GO_BACK' | tr }}
            </button>

            <button class="btn btn-sm btn-info" (click)="print()">
              <i-bs name="printer" aria-label="Copy content to clipboard"></i-bs>
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
              placement="right">
              <i-bs name="clipboard" aria-label="Copy content to clipboard"></i-bs>
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
      }
    `,
  ],
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    QRCodeModule,
    DfxTranslateModule,
    DfxCutPipe,
    NgbTooltipModule,
    AppIconsModule,
    AppBtnToolbarComponent,
    CopyDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppQrCodeViewComponent extends AComponent {
  qrCodeData?: qrCodeData;
  $isMobile: Subject<boolean>;

  constructor(
    @Inject(WINDOW) private window: Window,
    private translator: TranslateService,
    isMobileService: IsMobileService,
    qrCodeService: QrCodeService
  ) {
    super();
    this.$isMobile = isMobileService.isMobileChange;
    isMobileService.getIsMobile();

    this.qrCodeData = qrCodeService.getQRCodeData();

    if (!this.qrCodeData) {
      this.close();
    }
  }

  async print(): Promise<void> {
    const qrCode = document.getElementById('qrcode') as HTMLElement;
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    const canvas = await toJpeg(qrCode, {quality: 0.7, backgroundColor: '#FFFFFF'});
    pdf.addImage(canvas, 'JPEG', 70, 20, 450, 450);

    if (this.qrCodeData!.info.length > 0) {
      const text = this.translator.translate(this.qrCodeData!.info);

      let height = 500;
      for (const chunk of this.chunkString(text, 50)) {
        let xOffset = pdf.internal.pageSize.width / 2 - (pdf.getStringUnitWidth(chunk) * pdf.getFontSize()) / 2;
        pdf.text(chunk, xOffset, height);
        height += 20;
      }
    }

    pdf.save(`qrcode-${DateHelper.getFormattedWithHoursMinutesAndSeconds(new Date()) ?? ''}.pdf`);
  }

  close = (): void => this.window.self.close();

  chunkString(str: string, len: number): string[] {
    const input = str.trim().split(' ');
    let index = 0;
    const output: string[] = [];
    output[index] = '';
    input.forEach((word) => {
      const temp = `${output[index]} ${word}`.trim();
      if (temp.length <= len) {
        output[index] = temp;
      } else {
        index++;
        output[index] = word;
      }
    });
    return output;
  }
}

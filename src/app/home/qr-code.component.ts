import {Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxCutPipe, injectIsMobile, injectWindow} from 'dfx-helper';
import {QRCodeComponent} from 'dfx-qrcode';
import {NgxPrintDirective} from 'ngx-print';

import {CopyDirective} from '@shared/ui/copy.directive';

import {ScrollableToolbarComponent} from './_shared/components/scrollable-toolbar.component';
import {QrCodeService} from './_shared/services/qr-code.service';

@Component({
  template: `
    @if (qrCodeData(); as data) {
      <div class="my-container d-flex flex-row flex-wrap gap-5 align-items-center justify-content-center h-100" id="printContainer">
        <div class="qrcode-rounded" id="qrcode" style="background-color: #f6f6f6">
          @if (isMobile()) {
            <qrcode [size]="8" [margin]="0" [data]="data.data" errorCorrectionLevel="M" colorLight="#f6f6f6" />
          } @else {
            <qrcode [size]="14" [margin]="0" [data]="data.data" errorCorrectionLevel="M" colorLight="#f6f6f6" />
          }
        </div>
        <div class="card">
          <div class="card-header no-print">
            {{ data.text | transloco }}
          </div>
          <div class="card-body">
            @if (data.info.length > 0) {
              <p class="card-text" id="info-text">
                {{ data.info | transloco }}
              </p>
            }

            <a class="no-print" [href]="data.data" [ngbTooltip]="data.data" target="_blank" rel="noreferrer">{{
              data.data | s_cut: 82 : '...'
            }}</a>
          </div>
          <div class="card-footer text-muted no-print">
            <scrollable-toolbar>
              <button class="btn btn-sm btn-secondary" (mousedown)="back()" type="button">
                <bi name="arrow-left" />
                {{ 'GO_BACK' | transloco }}
              </button>

              <button
                class="btn btn-sm btn-info"
                [useExistingCss]="true"
                [printStyle]="{'.no-print': {display: 'none'}, '.qrcode-rounded': {display: 'flex', 'justify-content': 'center'}}"
                ngxPrint
                printSectionId="printContainer"
                type="button"
              >
                <bi name="printer" aria-label="Copy content to clipboard" />
                {{ 'PRINT' | transloco }}
              </button>

              <button
                class="btn btn-sm btn-primary"
                #c="copy"
                #t="ngbTooltip"
                [copyable]="data.data"
                [ngbTooltip]="'COPIED' | transloco"
                (click)="c.copy(t)"
                type="button"
                autoClose="false"
                triggers="manual"
                aria-label="Copy link"
                placement="right"
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
      padding: 15px;
      filter: brightness(125%);
    }
  `,
  selector: 'app-qr-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    QRCodeComponent,
    NgbTooltipModule,
    BiComponent,
    ScrollableToolbarComponent,
    CopyDirective,
    DfxCutPipe,
    TranslocoPipe,
    NgxPrintDirective,
  ],
})
export class AppQrCodeViewComponent {
  window = injectWindow();
  location = inject(Location);

  qrCodeData = inject(QrCodeService).data;
  isMobile = injectIsMobile();

  constructor() {
    effect(() => {
      if (!this.qrCodeData()) {
        this.back();
      }
    });
  }

  back = (): void => {
    this.location.back();
  };
}

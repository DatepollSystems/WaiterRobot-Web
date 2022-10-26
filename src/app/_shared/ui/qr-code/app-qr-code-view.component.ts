import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {AComponent, IsMobileService, loggerOf} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {QrCodeService} from '../../services/qr-code.service';
import {AppLogoWithTextComponent} from '../app-logo-with-text.component';
import {FooterModule} from '../footer/footer.module';

@Component({
  template: `
    <ng-template #inlineView>
      <div class="qrcode-rounded" placement="bottom" ngbTooltip="{{ 'QR_CODE_CLICK' | tr }}">
        <a (click)="openQrCodeInStandalone()">
          <qrcode
            *ngIf="data"
            [width]="isMobile ? 250 : 300"
            errorCorrectionLevel="M"
            [margin]="0"
            [qrdata]="data"
            colorLight="#f6f6f6"
            elementType="img"></qrcode>
        </a>
      </div>
    </ng-template>

    <div *ngIf="standalone; else inlineView">
      <div class="background-container d-flex flex-column gap-5 align-items-center justify-content-center h-100">
        <app-logo-with-text class="text-white"></app-logo-with-text>
        <div class="qrcode-rounded">
          <qrcode
            *ngIf="data"
            [width]="isMobile ? 300 : 600"
            errorCorrectionLevel="M"
            [margin]="0"
            colorLight="#f6f6f6"
            [qrdata]="data"></qrcode>
        </div>
        <div>
          <button class="btn btn-primary" (click)="close()">{{ 'GO_BACK' | tr }}</button>
        </div>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .background-container {
        width: 100%;
        background-color: var(--primary-8);
        padding-bottom: 5rem;
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
  selector: 'app-qr-code-view',
  standalone: true,
  imports: [NgIf, QRCodeModule, NgbTooltipModule, DfxTranslateModule, AppLogoWithTextComponent, FooterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppQrCodeViewComponent extends AComponent implements OnInit {
  @Input() data: string | undefined;

  isMobile = false;
  standalone = false;

  logger = loggerOf('QrCodeViewComponent');

  constructor(private router: Router, private qrCodeService: QrCodeService, private isMobileService: IsMobileService) {
    super();
    this.isMobile = this.isMobileService.isMobile;
    this.unsubscribe(
      this.isMobileService.isMobileChange.subscribe((isMobile) => {
        this.isMobile = isMobile;
      })
    );
  }

  ngOnInit(): void {
    if (this.data) {
      this.logger.log('onInit', 'Input data available; View is used in component', this.data);
    } else {
      this.standalone = true;
      this.logger.log('onInit', 'Input data unavailable; View is used as standalone; Loading data from storage');
      const data = this.qrCodeService.readQRCodeData();
      if (data) {
        this.logger.log('onInit', 'Storage qr code data available', data);
        this.data = data;
      } else {
        this.logger.info('onInit', 'Storage qr code data unavailable; Routing to /about');
        void this.router.navigateByUrl('/home');
      }
    }
  }

  openQrCodeInStandalone(): void {
    if (this.data) {
      this.qrCodeService.openQRCodeBig(this.data);
    }
  }

  close = (): void => window.self.close();
}

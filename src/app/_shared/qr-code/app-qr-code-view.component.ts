import {NgIf} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {QRCodeModule} from 'angularx-qrcode';
import {AComponent, IsMobileService, loggerOf} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {QrCodeService} from '../../_services/qr-code.service';

@Component({
  template: `
    <ng-template #inlineView>
      <div class="qrcode-rounded" placement="bottom" ngbTooltip="{{ 'QR_CODE_CLICK' | tr }}">
        <a (click)="openQrCodeInStandalone()">
          <qrcode
            *ngIf="data"
            [width]="isMobile ? 250 : 300"
            errorCorrectionLevel="Q"
            [margin]="0"
            [qrdata]="data"
            elementType="img"></qrcode>
        </a>
      </div>
    </ng-template>

    <div class="d-flex align-items-center justify-content-center h-100" *ngIf="standalone; else inlineView">
      <qrcode *ngIf="data" [width]="isMobile ? 300 : 600" errorCorrectionLevel="H" [margin]="0" [qrdata]="data"></qrcode>
    </div>
  `,
  styles: [
    `
      .qrcode-rounded {
        border-radius: 15px;
        border-width: 5px;
        background-color: white;
        padding: 15px;
      }
    `,
  ],
  selector: 'app-qr-code-view',
  standalone: true,
  imports: [NgIf, QRCodeModule, NgbTooltipModule, DfxTranslateModule],
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
    if (!this.standalone && this.data) {
      this.qrCodeService.openQRCodeBig(this.data);
    }
  }
}

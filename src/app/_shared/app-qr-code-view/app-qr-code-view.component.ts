import {Component, Input, OnInit} from '@angular/core';
import {NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';
import {QrCodeService} from '../../_services/qr-code.service';
import {IsMobileService, LoggerFactory} from 'dfx-helper';
import {Router} from '@angular/router';

@Component({
  selector: 'app-qr-code-view',
  templateUrl: './app-qr-code-view.component.html',
  styleUrls: ['./app-qr-code-view.component.scss'],
})
export class AppQrCodeViewComponent implements OnInit {
  @Input() data: string | undefined;
  @Input() correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  isMobile = false;
  standalone = false;

  logger = LoggerFactory.getLogger('QrCodeViewComponent');

  constructor(private router: Router, private qrCodeService: QrCodeService, private isMobileService: IsMobileService) {
    this.isMobile = this.isMobileService.getIsMobile();
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

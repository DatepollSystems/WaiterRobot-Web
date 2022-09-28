import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AComponent, IsMobileService, loggerOf} from 'dfx-helper';
import {QrCodeService} from '../../_services/qr-code.service';

@Component({
  selector: 'app-qr-code-view',
  templateUrl: './app-qr-code-view.component.html',
  styleUrls: ['./app-qr-code-view.component.scss'],
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

import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StorageHelper} from 'dfx-helper';
import {WINDOW} from './windows-provider';

export type qrCodeData = {data: string; text: string; info: string};

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private router: Router, @Inject(WINDOW) private window: Window) {}

  public openQRCodePage(props: qrCodeData) {
    StorageHelper.set('qr-code-data', props);
    // Converts the route into a string that can be used with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree(['/home/qrcode/view']));

    this.window.open(url, '_blank');
  }

  getQRCodeData = (): qrCodeData | undefined => StorageHelper.getObject('qr-code-data') as qrCodeData | undefined;

  public openQRCodeBig(data: string): void {
    StorageHelper.set('qr-code-data', data);
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree(['/qrcode/view']));

    this.window.open(url, '_blank');
  }

  public readQRCodeData(): string | undefined {
    return StorageHelper.getString('qr-code-data');
  }
}

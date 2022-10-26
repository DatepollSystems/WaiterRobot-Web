import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StorageHelper} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private router: Router) {}

  public openQRCodeBig(data: string): void {
    StorageHelper.set('qr-code-data', data);
    // Converts the route into a string that can be used
    // with the window.open() function
    const url = this.router.serializeUrl(this.router.createUrlTree(['/qrcode/view']));

    window.open(url, '_blank');
  }

  public readQRCodeData(): string | undefined {
    return StorageHelper.getString('qr-code-data');
  }
}

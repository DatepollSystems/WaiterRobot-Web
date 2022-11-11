import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {StorageHelper} from 'dfx-helper';

export type qrCodeData = {data: string; text: string; info: string};

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private router: Router) {}

  openQRCodePage(props: qrCodeData): void {
    StorageHelper.set('qr-code-data', props);
    // Converts the route into a string that can be used with the window.open() function
    //const url = this.router.serializeUrl(this.router.createUrlTree(['/home/qrcode/view']));
    void this.router.navigateByUrl('/home/qrcode/view');
  }

  getQRCodeData = (): qrCodeData | undefined => StorageHelper.getObject('qr-code-data') as qrCodeData | undefined;
}

import {computed, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

import {st_set} from 'dfts-helper';

export type qrCodeData = {data: string; text: string; info: string};

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private router: Router) {}

  private _data = signal<qrCodeData | undefined>(undefined);

  data = computed(() => this._data());

  openQRCodePage(props: qrCodeData): void {
    st_set('qr-code-data', props);
    this._data.set(props);
    void this.router.navigateByUrl('/qrcode/view');
  }
}

import {computed, inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

import {st_set} from 'dfts-helper';

export interface qrCodeData {
  data: string;
  text: string;
  info: string;
}

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  #router = inject(Router);

  private _data = signal<qrCodeData | undefined>(undefined);

  data = computed(() => this._data());

  openQRCodePage(props: qrCodeData): void {
    st_set('qr-code-data', props);
    this._data.set(props);
    void this.#router.navigateByUrl('/qrcode/view');
  }
}

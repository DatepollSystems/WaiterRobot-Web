import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeScannerModalComponent} from './app-qr-code-scanner-modal.component';

@NgModule({
  declarations: [AppQrCodeScannerModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexLayoutModule, ZXingScannerModule],
  exports: [AppQrCodeScannerModalComponent],
})
export class AppQrCodeScannerModalModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {AppQrCodeScannerModalComponent} from './app-qr-code-scanner-modal.component';

@NgModule({
  declarations: [AppQrCodeScannerModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexLayoutModule, ZXingScannerModule],
  exports: [AppQrCodeScannerModalComponent],
})
export class AppQrCodeScannerModalModule {}
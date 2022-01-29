import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgxPrintModule} from 'ngx-print';

import {AppQrCodeModalComponent} from './app-qr-code-modal.component';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [AppQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexModule, NgxPrintModule, NgxQRCodeModule],
  exports: [AppQrCodeModalComponent],
})
export class AppQrCodeModalModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgxPrintModule} from 'ngx-print';

import {AppQrCodeModalComponent} from './app-qr-code-modal.component';
import {AppQrCodeViewModule} from '../app-qr-code-view/app-qr-code-view.module';

@NgModule({
  declarations: [AppQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexLayoutModule, NgxPrintModule, AppQrCodeViewModule],
  exports: [AppQrCodeModalComponent],
})
export class AppQrCodeModalModule {}

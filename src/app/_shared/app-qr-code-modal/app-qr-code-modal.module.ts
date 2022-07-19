import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {DfxPrintModule} from 'dfx-helper';

import {AppQrCodeModalComponent} from './app-qr-code-modal.component';
import {AppQrCodeViewModule} from '../app-qr-code-view/app-qr-code-view.module';

@NgModule({
  declarations: [AppQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexLayoutModule, DfxPrintModule, AppQrCodeViewModule],
  exports: [AppQrCodeModalComponent],
})
export class AppQrCodeModalModule {}

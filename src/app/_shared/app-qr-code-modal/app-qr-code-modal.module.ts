import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {QrCodeModule} from 'ng-qrcode';

import {AppQrCodeModalComponent} from './app-qr-code-modal.component';

@NgModule({
  declarations: [AppQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, NgbTooltipModule, QrCodeModule, FlexModule],
  exports: [AppQrCodeModalComponent],
})
export class AppQrCodeModalModule {}

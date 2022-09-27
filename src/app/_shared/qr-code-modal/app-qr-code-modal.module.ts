import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxPrintDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppQrCodeViewModule} from '../qr-code-view/app-qr-code-view.module';

import {AppQrCodeModalComponent} from './app-qr-code-modal.component';

@NgModule({
  declarations: [AppQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, FlexLayoutModule, DfxPrintDirective, AppQrCodeViewModule, NgbTooltipModule],
  exports: [AppQrCodeModalComponent],
})
export class AppQrCodeModalModule {}

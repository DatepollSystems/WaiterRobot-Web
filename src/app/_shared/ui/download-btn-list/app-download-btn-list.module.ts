import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule} from 'dfx-helper';

import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeModalComponent} from '../qr-code/app-qr-code-modal.component';

import {AppIconsModule} from '../icons.module';

import {AppDownloadBtnListComponent} from './app-download-btn-list.component';
import {AppDownloadQrCodeModalComponent} from './app-download-qr-code-modal.component';

@NgModule({
  declarations: [AppDownloadBtnListComponent, AppDownloadQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, DfxTrackByModule, AppIconsModule, NgbTooltipModule, AppQrCodeModalComponent],
  exports: [AppDownloadBtnListComponent],
})
export class AppDownloadBtnListModule {}

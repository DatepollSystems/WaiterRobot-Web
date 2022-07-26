import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule} from 'dfx-helper';

import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeModalModule} from '../app-qr-code-modal/app-qr-code-modal.module';

import {IconsModule} from '../icons.module';

import {AppDownloadBtnListComponent} from './app-download-btn-list.component';
import {AppDownloadQrCodeModalComponent} from './app-download-qr-code-modal.component';

@NgModule({
  declarations: [AppDownloadBtnListComponent, AppDownloadQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, DfxTrackByModule, IconsModule, NgbTooltipModule, AppQrCodeModalModule],
  exports: [AppDownloadBtnListComponent],
})
export class AppDownloadBtnListModule {}

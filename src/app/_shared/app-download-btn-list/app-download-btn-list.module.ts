import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DfxTranslateModule} from 'dfx-translate';
import {DfxTrackByModule} from 'dfx-helper';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../icons.module';
import {AppQrCodeModalModule} from '../app-qr-code-modal/app-qr-code-modal.module';

import {AppDownloadBtnListComponent} from './app-download-btn-list.component';
import {AppDownloadQrCodeModalComponent} from './app-download-qr-code-modal.component';

@NgModule({
  declarations: [AppDownloadBtnListComponent, AppDownloadQrCodeModalComponent],
  imports: [CommonModule, DfxTranslateModule, DfxTrackByModule, IconsModule, NgbTooltipModule, AppQrCodeModalModule],
  exports: [AppDownloadBtnListComponent],
})
export class AppDownloadBtnListModule {}

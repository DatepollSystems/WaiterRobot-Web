import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTimeSpanPipe} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppDownloadBtnListModule} from '../../_shared/download-btn-list/app-download-btn-list.module';
import {IconsModule} from '../../_shared/icons.module';
import {StartComponent} from './start.component';

const startRoutes: Routes = [{path: '', component: StartComponent}];

@NgModule({
  declarations: [StartComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(startRoutes),
    FlexLayoutModule,
    AppDownloadBtnListModule,
    NgbTooltipModule,
    DfxTimeSpanPipe,
    NgbDropdownModule,
    IconsModule,
  ],
})
export class StartModule {}

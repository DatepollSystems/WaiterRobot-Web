import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {RouterModule, Routes} from '@angular/router';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListModule} from '../../_shared/download-btn-list/app-download-btn-list.module';
import {StartComponent} from './start.component';
import {TimeSpanModule} from '../../_shared/time-span.pipe';

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
    TimeSpanModule,
  ],
})
export class StartModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DfxTranslateModule} from 'dfx-translate';

import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './start.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AppDownloadBtnListModule} from '../../_shared/app-download-btn-list/app-download-btn-list.module';

const startRoutes: Routes = [{path: '', component: StartComponent}];

@NgModule({
  declarations: [StartComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, AppDownloadBtnListModule],
})
export class StartModule {}

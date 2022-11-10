import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTimeSpanPipe} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListComponent} from '../../_shared/ui/app-download-btn-list.component';

import {AppIconsModule} from '../../_shared/ui/icons.module';
import {StartComponent} from './start.component';

const startRoutes: Routes = [{path: '', component: StartComponent}];

@NgModule({
  declarations: [StartComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(startRoutes),
    AppDownloadBtnListComponent,
    NgbTooltipModule,
    DfxTimeSpanPipe,
    NgbDropdownModule,
    AppIconsModule,
  ],
})
export class StartModule {}

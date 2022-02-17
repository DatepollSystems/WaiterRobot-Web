import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterModule} from '../footer/footer.module';
import {AppBownloadBtnListModule} from '../_shared/app-download-btn-list/app-bownload-btn-list.module';

import {MobileLinkComponent} from './mobile-link.component';

const routes: Routes = [
  {path: '', component: MobileLinkComponent},
  {path: ':id', component: MobileLinkComponent},
];

@NgModule({
  declarations: [MobileLinkComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FlexLayoutModule, DfxTranslateModule, AppBownloadBtnListModule, FooterModule],
})
export class MobileLinkModule {}

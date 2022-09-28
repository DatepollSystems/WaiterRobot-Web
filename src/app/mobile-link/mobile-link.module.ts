import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListModule} from '../_shared/download-btn-list/app-download-btn-list.module';
import {AppLogoWithTextComponent} from '../_shared/app-logo-with-text.component';

import {FooterModule} from '../_shared/footer/footer.module';

import {MobileLinkComponent} from './mobile-link.component';

const routes: Routes = [
  {path: '', component: MobileLinkComponent},
  {path: ':id', component: MobileLinkComponent},
];

@NgModule({
  declarations: [MobileLinkComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    DfxTranslateModule,
    AppDownloadBtnListModule,
    AppLogoWithTextComponent,
    FooterModule,
  ],
})
export class MobileLinkModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';
import {AppDownloadBtnListModule} from '../_shared/app-download-btn-list/app-download-btn-list.module';
import {AppLogoWithTextComponent} from '../_shared/app-logo-with-text/app-logo-with-text.component';

import {FooterModule} from '../footer/footer.module';

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
    FlexLayoutModule,
    DfxTranslateModule,
    AppDownloadBtnListModule,
    AppLogoWithTextComponent,
    FooterModule,
  ],
})
export class MobileLinkModule {}

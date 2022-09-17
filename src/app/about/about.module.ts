import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IsAuthenticatedGuardService} from '../_services/auth/is-authenticated-guard.service';
import {AppDownloadBtnListModule} from '../_shared/app-download-btn-list/app-download-btn-list.module';
import {AppLogoWithTextComponent} from '../_shared/app-logo-with-text.component';
import {IconsModule} from '../_shared/icons.module';
import {FooterModule} from '../_shared/footer/footer.module';

import {AboutComponent} from './about.component';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';

const routes: Routes = [{path: '', component: AboutComponent, canActivate: [IsAuthenticatedGuardService]}];

@NgModule({
  declarations: [AboutComponent, AppAccountNotActivatedDialog, AppForgotPasswordDialog],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    NgbModule,
    DfxTranslateModule,
    FooterModule,
    IconsModule,
    AppDownloadBtnListModule,
    AppLogoWithTextComponent,
  ],
})
export class AboutModule {}

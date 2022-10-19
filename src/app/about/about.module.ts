import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IsAuthenticatedGuardService} from '../_services/auth/is-authenticated-guard.service';
import {AppLogoWithTextComponent} from '../_shared/app-logo-with-text.component';
import {AppDownloadBtnListModule} from '../_shared/download-btn-list/app-download-btn-list.module';
import {FooterModule} from '../_shared/footer/footer.module';
import {IconsModule} from '../_shared/icons.module';

import {AboutComponent} from './about.component';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

const routes: Routes = [{path: '', component: AboutComponent, canActivate: [IsAuthenticatedGuardService]}];

@NgModule({
  declarations: [AboutComponent, AppAccountNotActivatedDialog, AppForgotPasswordDialog, AppPasswordChangeDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgbModule,
    DfxTranslateModule,
    FooterModule,
    IconsModule,
    AppDownloadBtnListModule,
    AppLogoWithTextComponent,
  ],
})
export class AboutModule {}

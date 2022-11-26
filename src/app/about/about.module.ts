import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';

import {IsAuthenticatedGuardService} from '../_shared/services/auth/is-authenticated-guard.service';
import {AppDownloadBtnListComponent} from '../_shared/ui/app-download-btn-list.component';
import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppIconsModule} from '../_shared/ui/icons.module';

import {AboutComponent} from './about.component';
import {AppAccountNotActivatedDialog} from './account-not-activated-dialog.component';
import {AppForgotPasswordDialog} from './forgot-password-dialog.component';
import {AppPasswordChangeDialogComponent} from './password-change-dialog.component';

const ROUTES: Routes = [{path: '', component: AboutComponent, canActivate: [IsAuthenticatedGuardService]}];

@NgModule({
  declarations: [AboutComponent, AppAccountNotActivatedDialog, AppForgotPasswordDialog, AppPasswordChangeDialogComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    FormsModule,
    NgbModule,
    DfxTr,
    FooterModule,
    AppIconsModule,
    AppDownloadBtnListComponent,
    AppLogoWithTextComponent,
  ],
})
export class AboutModule {}

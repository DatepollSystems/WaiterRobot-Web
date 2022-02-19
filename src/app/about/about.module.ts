import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {FooterModule} from '../footer/footer.module';
import {IconsModule} from '../_shared/icons.module';
import {AppDownloadBtnListModule} from '../_shared/app-download-btn-list/app-download-btn-list.module';
import {IsAuthenticatedGuardService} from '../_services/auth/is-authenticated-guard.service';

import {AboutComponent} from './about.component';

const routes: Routes = [{path: '', component: AboutComponent, canActivate: [IsAuthenticatedGuardService]}];

@NgModule({
  declarations: [AboutComponent],
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
  ],
})
export class AboutModule {}

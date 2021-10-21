import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AboutRoutingModule} from './about-routing.module';

import {AboutComponent} from './about.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FooterModule} from '../footer/footer.module';
import {IconsModule} from '../_shared/icons.module';
import {AppBownloadBtnListModule} from '../_shared/app-download-btn-list/app-bownload-btn-list.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    AboutRoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    DfxTranslateModule,
    FooterModule,
    FlexLayoutModule,
    IconsModule,
    AppBownloadBtnListModule,
  ],
  providers: [],
})
export class AboutModule {}

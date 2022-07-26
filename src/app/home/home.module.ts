import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeModalModule} from '../_shared/app-qr-code-modal/app-qr-code-modal.module';

import {IconsModule} from '../_shared/icons.module';
import {FooterModule} from '../footer/footer.module';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';

@NgModule({
  declarations: [HomeComponent, UserEmailQRCodeModalComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    DfxTrackByModule,
    FlexLayoutModule,
    IconsModule,
    FooterModule,
    NgbDropdownModule,
    HomeRoutingModule,
    AppQrCodeModalModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}

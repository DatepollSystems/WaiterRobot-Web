import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../_shared/icons.module';
import {FooterModule} from '../footer/footer.module';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';
import {AppQrCodeModalModule} from '../_shared/app-qr-code-modal/app-qr-code-modal.module';

@NgModule({
  declarations: [HomeComponent, UserEmailQRCodeModalComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    FlexLayoutModule,
    IconsModule,
    FooterModule,
    NgbDropdownModule,
    AppQrCodeModalModule,
    HomeRoutingModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}

import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule, HideIfOnlineDirective, HideIfPingSucceedsDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppQrCodeModalModule} from '../_shared/qr-code-modal/app-qr-code-modal.module';
import {IconsModule} from '../_shared/icons.module';
import {FooterModule} from '../_shared/footer/footer.module';
import {HomeRoutingModule} from './home-routing.module';
import {AppNavbarScrollableComponent} from '../_shared/navbar-scrollable/app-navbar-scrollable.component';

import {HomeComponent} from './home.component';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';

@NgModule({
  declarations: [HomeComponent, UserEmailQRCodeModalComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    DragDropModule,
    NgbDropdownModule,
    DfxTranslateModule,
    DfxTrackByModule,
    IconsModule,
    FooterModule,
    AppNavbarScrollableComponent,
    AppQrCodeModalModule,
    HideIfOnlineDirective,
    HideIfPingSucceedsDirective,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}

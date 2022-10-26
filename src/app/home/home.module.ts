import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule, HideIfOnlineDirective, HideIfPingSucceedsDirective} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {FooterModule} from '../_shared/ui/footer/footer.module';

import {IconsModule} from '../_shared/ui/icons.module';
import {AppNavbarScrollableComponent} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {AppQrCodeModalComponent} from '../_shared/ui/qr-code/app-qr-code-modal.component';
import {HomeRoutingModule} from './home-routing.module';

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
    HideIfOnlineDirective,
    HideIfPingSucceedsDirective,
    IconsModule,
    FooterModule,
    AppNavbarScrollableComponent,
    AppQrCodeModalComponent,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}

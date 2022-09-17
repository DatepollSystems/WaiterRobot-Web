import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeModalModule} from '../_shared/qr-code-modal/app-qr-code-modal.module';

import {IconsModule} from '../_shared/icons.module';
import {OfflineModule} from '../_shared/offline.directive';
import {FooterModule} from '../_shared/footer/footer.module';
import {AppNavbarScrollableComponent} from '../_shared/navbar-scrollable/app-navbar-scrollable.component';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {UserEmailQRCodeModalComponent} from './user-email-qr-code-modal.component';
import {HideIfPingSucceedsDirective} from '../_shared/ping.directive';

@NgModule({
  declarations: [HomeComponent, UserEmailQRCodeModalComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    DfxTranslateModule,
    DfxTrackByModule,
    FlexLayoutModule,
    IconsModule,
    FooterModule,
    NgbDropdownModule,
    AppQrCodeModalModule,
    OfflineModule,
    DragDropModule,
    AppNavbarScrollableComponent,
    HideIfPingSucceedsDirective,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}

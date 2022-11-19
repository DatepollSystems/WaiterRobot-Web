import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxHideIfOnline, DfxHideIfPingSucceeds, DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {FooterModule} from '../_shared/ui/footer/footer.module';

import {AppIconsModule} from '../_shared/ui/icons.module';
import {AppNavbarScrollableComponent} from '../_shared/ui/navbar-scrollable/app-navbar-scrollable.component';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    DragDropModule,
    NgbDropdownModule,
    DfxTranslateModule,
    DfxTrackByModule,
    DfxHideIfOnline,
    DfxHideIfPingSucceeds,
    AppIconsModule,
    FooterModule,
    AppNavbarScrollableComponent,
  ],
})
export class HomeModule {}

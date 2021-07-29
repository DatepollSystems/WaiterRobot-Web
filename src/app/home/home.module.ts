import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterModule} from '../footer/footer.module';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {IconsModule} from '../_helper/icons.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, DfxTranslateModule, FooterModule, HomeRoutingModule, FlexModule, NgbDropdownModule, IconsModule],
  exports: [HomeComponent],
})
export class HomeModule {}

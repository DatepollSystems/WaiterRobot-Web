import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterModule} from '../footer/footer.module';
import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, DfxTranslateModule, FooterModule, HomeRoutingModule],
  exports: [HomeComponent],
})
export class HomeModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, FlexLayoutModule, DfxTranslateModule],
  exports: [FooterComponent],
})
export class FooterModule {}

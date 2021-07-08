import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AboutRoutingModule} from './about-routing.module';

import {AboutComponent} from './about.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

@NgModule({
  declarations: [AboutComponent],
  imports: [AboutRoutingModule, CommonModule, FormsModule, NgbModule, DfxTranslateModule],
  providers: [],
})
export class AboutModule {}

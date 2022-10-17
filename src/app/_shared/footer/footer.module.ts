import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent],
  imports: [CommonModule, RouterModule, FormsModule, DfxTranslateModule, NgbNavModule],
  exports: [FooterComponent],
})
export class FooterModule {}

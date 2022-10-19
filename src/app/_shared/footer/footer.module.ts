import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLinkWithHref} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent],
  imports: [CommonModule, RouterLinkWithHref, FormsModule, DfxTranslateModule, NgbNavModule],
  exports: [FooterComponent],
})
export class FooterModule {}

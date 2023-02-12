import {AsyncPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './about-modal/about-modal.component';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent],
  imports: [FormsModule, AsyncPipe, RouterLink, NgbNav, NgbNavLink, NgbNavContent, NgbNavItem, NgbNavOutlet, DfxTr],
  exports: [FooterComponent],
})
export class FooterModule {}

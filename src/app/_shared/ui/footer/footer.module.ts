import {AsyncPipe, NgIf} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

import {NgForOr} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {AboutModalComponent} from './about-modal.component';
import {FooterComponent} from './footer.component';

@NgModule({
  declarations: [AboutModalComponent, FooterComponent],
  imports: [AsyncPipe, DfxTr, FormsModule, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet, NgForOr, NgIf, RouterLink],
  exports: [FooterComponent],
})
export class FooterModule {}

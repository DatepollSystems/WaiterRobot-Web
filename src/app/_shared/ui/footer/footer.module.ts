import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './about-modal/about-modal.component';

@NgModule({
  declarations: [FooterComponent, AboutModalComponent],
  imports: [CommonModule, RouterLink, FormsModule, DfxTranslateModule, NgbNavModule],
  exports: [FooterComponent],
})
export class FooterModule {}
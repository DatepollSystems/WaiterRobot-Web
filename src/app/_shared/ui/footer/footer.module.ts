import {AsyncPipe, LowerCasePipe, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {DfxTr} from 'dfx-translate';

import {AboutModalComponent} from './about-modal.component';
import {FooterComponent} from './footer.component';

@NgModule({
  declarations: [AboutModalComponent, FooterComponent],
  imports: [AsyncPipe, DfxTr, FormsModule, LowerCasePipe, NgbNavModule, NgOptimizedImage, RouterLink],
  exports: [FooterComponent],
})
export class FooterModule {}

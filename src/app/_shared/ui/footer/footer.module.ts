import {AsyncPipe, LowerCasePipe, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {TranslocoPipe} from '@ngneat/transloco';

import {AboutModalComponent} from './about-modal.component';
import {FooterComponent} from './footer.component';

@NgModule({
  declarations: [AboutModalComponent, FooterComponent],
  imports: [AsyncPipe, FormsModule, LowerCasePipe, NgbNavModule, NgOptimizedImage, RouterLink, TranslocoPipe],
  exports: [FooterComponent],
})
export class FooterModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../icons.module';
import {SelectableButtonComponent} from './selectable-button.component';

@NgModule({
  declarations: [SelectableButtonComponent],
  imports: [CommonModule, DfxTranslateModule, IconsModule, NgbTooltipModule],
  exports: [SelectableButtonComponent],
})
export class SelectableButtonModule {}

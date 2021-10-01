import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {CommonModule} from '@angular/common';
import {BootstrapChipInputComponent} from './bootstrap-chip-input.component';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {IconsModule} from '../icons.module';

@NgModule({
  declarations: [BootstrapChipInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, DfxTranslateModule, NgbTypeaheadModule, IconsModule],
  exports: [BootstrapChipInputComponent],
})
export class BootstrapChipInputModule {}

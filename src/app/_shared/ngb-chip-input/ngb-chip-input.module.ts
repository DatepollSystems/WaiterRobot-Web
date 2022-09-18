import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../icons.module';
import {NgbChipInput} from './ngb-chip-input.component';

@NgModule({
  declarations: [NgbChipInput],
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, DfxTranslateModule, IconsModule],
  exports: [NgbChipInput],
})
export class NgbChipInputModule {}

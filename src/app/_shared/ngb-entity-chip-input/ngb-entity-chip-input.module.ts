import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../icons.module';

import {NgbEntityChipInput} from './ngb-entity-chip-input.component';

@NgModule({
  declarations: [NgbEntityChipInput],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, DfxTranslateModule, NgbTypeaheadModule, IconsModule],
  exports: [NgbEntityChipInput],
})
export class NgbEntityChipInputModule {}

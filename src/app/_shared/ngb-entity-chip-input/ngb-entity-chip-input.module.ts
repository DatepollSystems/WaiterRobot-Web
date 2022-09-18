import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTrackByModule} from 'dfx-helper';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../icons.module';

import {NgbEntityChipInput} from './ngb-entity-chip-input.component';

@NgModule({
  declarations: [NgbEntityChipInput],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DfxTranslateModule,
    DfxTrackByModule,
    NgbTypeaheadModule,
    IconsModule,
  ],
  exports: [NgbEntityChipInput],
})
export class NgbEntityChipInputModule {}

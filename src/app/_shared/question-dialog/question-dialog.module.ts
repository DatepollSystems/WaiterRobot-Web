import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

import {TrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {QuestionDialogComponent} from './question-dialog.component';

@NgModule({
  declarations: [QuestionDialogComponent],
  imports: [CommonModule, FlexLayoutModule, DfxTranslateModule, TrackByModule],
  exports: [QuestionDialogComponent],
})
export class QuestionDialogModule {}

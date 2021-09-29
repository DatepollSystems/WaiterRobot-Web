import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {QuestionDialogComponent} from './question-dialog.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [QuestionDialogComponent],
  imports: [CommonModule, FlexLayoutModule, DfxTranslateModule],
  exports: [QuestionDialogComponent],
})
export class QuestionDialogModule {}

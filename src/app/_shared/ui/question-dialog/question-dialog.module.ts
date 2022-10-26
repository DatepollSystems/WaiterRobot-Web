import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {QuestionDialogTriggerComponent} from './question-dialog-trigger.component';

import {QuestionDialogComponent} from './question-dialog.component';

@NgModule({
  declarations: [QuestionDialogComponent, QuestionDialogTriggerComponent, ConfirmDialogComponent],
  imports: [CommonModule, DfxTranslateModule, DfxTrackByModule],
  exports: [QuestionDialogComponent, QuestionDialogTriggerComponent, ConfirmDialogComponent],
})
export class QuestionDialogModule {}

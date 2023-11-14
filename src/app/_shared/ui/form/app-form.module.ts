/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import {AsyncPipe} from '@angular/common';
import {NgModule} from '@angular/core';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppBackButtonComponent} from '../button/app-back-button.component';
import {ScrollableToolbarComponent} from '../button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../loading/app-spinner-row.component';
import {AppIsCreatingDirective, AppIsEditingDirective} from './app-form-state.directives';
import {AppModelEditSaveBtn} from './app-model-edit-save-btn.component';

@NgModule({
  declarations: [AppIsCreatingDirective, AppIsEditingDirective, AppModelEditSaveBtn],
  imports: [AppBackButtonComponent, AppSpinnerRowComponent, ScrollableToolbarComponent, AsyncPipe, BiComponent, DfxTr, NgbNavModule],
  exports: [
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppModelEditSaveBtn,
    AppBackButtonComponent,
    AppSpinnerRowComponent,
    ScrollableToolbarComponent,
    AsyncPipe,
    BiComponent,
    DfxTr,
    NgbNavModule,
  ],
})
export class AppFormModule {}

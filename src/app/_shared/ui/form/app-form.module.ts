import {NgIf} from '@angular/common';
import {NgModule} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppBackButtonComponent} from '../button/app-back-button.component';
import {ScrollableToolbarComponent} from '../button/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../loading/app-spinner-row.component';
import {AppIsCreatingDirective, AppIsEditingDirective} from './app-form-state.directives';
import {AppModelEditSaveBtn} from './app-model-edit-save-btn.component';

@NgModule({
  declarations: [AppIsCreatingDirective, AppIsEditingDirective, AppModelEditSaveBtn],
  imports: [AppBackButtonComponent, ScrollableToolbarComponent, AppSpinnerRowComponent, BiComponent, DfxTr, NgIf],
  exports: [
    AppBackButtonComponent,
    ScrollableToolbarComponent,
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppModelEditSaveBtn,
    AppSpinnerRowComponent,
  ],
})
export class AppFormModule {}

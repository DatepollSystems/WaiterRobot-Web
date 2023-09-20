import {NgModule} from '@angular/core';
import {NgIf} from '@angular/common';

import {DfxTr} from 'dfx-translate';

import {AppModelEditSaveBtn} from './app-model-edit-save-btn.component';
import {AppBtnToolbarComponent} from '../button/app-btn-toolbar.component';
import {AppSpinnerRowComponent} from '../loading/app-spinner-row.component';
import {AppBackButtonComponent} from '../button/app-back-button.component';
import {AppIsCreatingDirective, AppIsEditingDirective} from './app-form-state.directives';
import {AppIconsModule} from '../icons.module';

@NgModule({
  declarations: [AppIsCreatingDirective, AppIsEditingDirective, AppModelEditSaveBtn],
  imports: [AppBackButtonComponent, AppBtnToolbarComponent, AppIconsModule, AppSpinnerRowComponent, DfxTr, NgIf],
  exports: [
    AppBackButtonComponent,
    AppBtnToolbarComponent,
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppModelEditSaveBtn,
    AppSpinnerRowComponent,
  ],
})
export class AppFormModule {}

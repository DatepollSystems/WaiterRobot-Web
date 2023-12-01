/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import {NgModule} from '@angular/core';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppBackButtonComponent} from '../components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../components/scrollable-toolbar.component';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {AppIsCreatingDirective, AppIsEditingDirective} from './app-entity-state.directives';

@NgModule({
  declarations: [AppIsCreatingDirective, AppIsEditingDirective],
  imports: [AppBackButtonComponent, AppSpinnerRowComponent, ScrollableToolbarComponent, BiComponent, DfxTr],
  exports: [
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppBackButtonComponent,
    AppSpinnerRowComponent,
    ScrollableToolbarComponent,
    BiComponent,
    DfxTr,
  ],
})
export class AppEntityEditModule {}

/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import {NgModule} from '@angular/core';

import {AppEntityEditPlaceholder} from '@home-shared/form/app-entity-edit.placeholder';

import {BiComponent} from 'dfx-bootstrap-icons';
import {TranslocoPipe} from '@ngneat/transloco';

import {AppBackButtonComponent} from '../components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../components/scrollable-toolbar.component';
import {AppIsCreatingDirective, AppIsEditingDirective} from './app-entity-state.directives';

@NgModule({
  declarations: [AppIsCreatingDirective, AppIsEditingDirective],
  imports: [AppBackButtonComponent, AppEntityEditPlaceholder, ScrollableToolbarComponent, BiComponent, TranslocoPipe],
  exports: [
    AppIsCreatingDirective,
    AppIsEditingDirective,
    AppBackButtonComponent,
    AppEntityEditPlaceholder,
    ScrollableToolbarComponent,
    BiComponent,
    TranslocoPipe,
  ],
})
export class AppEntityEditModule {}

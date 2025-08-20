import {NgModule} from '@angular/core';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

import {AppBackButtonComponent} from '../../components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../components/scrollable-toolbar.component';
import {AppEntityEditPlaceholder} from './app-entity-edit.placeholder';
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

import {AsyncPipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbDropdownModule, NgbInputDatepicker, NgbNavModule, NgbTimepicker, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BarChartModule, LineChartModule, PieChartModule} from '@swimlane/ngx-charts';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCurrencyCentPipe} from 'dfx-helper';
import {NgxPrintDirective} from 'ngx-print';

import {AppBackButtonComponent} from '../button/app-back-button.component';
import {AppDatetimeInputComponent} from '../datetime-picker/datetime-picker.component';
import {AppSpinnerRowComponent} from '../loading';
import {ScrollableToolbarComponent} from '../scrollable-toolbar.component';
import {BlurToggleComponent} from './blur-toggle.component';
import {StatisticsCardComponent} from './statistics-card.component';
import {SumProductGroupsComponent} from './sum-product-groups.component';
import {SumProductsPerWaiterComponent} from './sum-products-per-waiter.component';
import {SumStatisticsComponent} from './sum/sum-statistics.component';
import {TimelineComponent} from './timeline.component';

@NgModule({
  declarations: [
    StatisticsCardComponent,
    SumProductGroupsComponent,
    SumProductsPerWaiterComponent,
    SumStatisticsComponent,
    TimelineComponent,
  ],
  exports: [StatisticsCardComponent, SumProductGroupsComponent, SumProductsPerWaiterComponent, SumStatisticsComponent, TimelineComponent],
  imports: [
    AppBackButtonComponent,
    AppDatetimeInputComponent,
    AppSpinnerRowComponent,
    AsyncPipe,
    BarChartModule,
    BiComponent,
    BlurToggleComponent,
    DfxCurrencyCentPipe,
    DfxPaginationModule,
    DfxSortModule,
    DfxTableModule,
    LineChartModule,
    NgbDropdownModule,
    NgbInputDatepicker,
    NgbNavModule,
    NgbTimepicker,
    NgbTooltipModule,
    NgxPrintDirective,
    PieChartModule,
    ReactiveFormsModule,
    ScrollableToolbarComponent,
    TranslocoPipe,
  ],
})
export class StatisticsModule {}

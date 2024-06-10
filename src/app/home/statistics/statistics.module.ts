import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbInputDatepicker, NgbNavModule, NgbTimepicker, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';
import {BarChartModule, LineChartModule, PieChartModule} from '@swimlane/ngx-charts';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCountUp} from 'dfx-helper';
import {NgxPrintDirective} from 'ngx-print';

import {AppBackButtonComponent} from '../_shared/components/button/app-back-button.component';
import {AppDatetimeInputComponent} from '../_shared/components/datetime-picker/datetime-picker.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {BlurToggleComponent} from './blur-toggle.component';
import {CountCardComponent} from './components/count-card.component';
import {SumProductGroupsComponent} from './components/sum-product-groups.component';
import {SumProductsPerWaiterComponent} from './components/sum-products-per-waiter.component';
import {SumProductsComponent} from './components/sum-products.component';
import {SumStatisticsComponent} from './components/sum/sum-statistics.component';
import {TimelineComponent} from './components/timeline.component';
import {StatisticsComponent} from './statistics.component';

const routes: Routes = [
  {
    path: '',
    children: [{path: '', component: StatisticsComponent}],
  },
  {path: 'products', component: SumProductsComponent},
];

@NgModule({
  declarations: [
    CountCardComponent,
    StatisticsComponent,
    SumProductGroupsComponent,
    SumProductsComponent,
    SumProductsPerWaiterComponent,
    SumStatisticsComponent,
    TimelineComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    AppBackButtonComponent,
    AppDatetimeInputComponent,
    AppSpinnerRowComponent,
    BarChartModule,
    BiComponent,
    BlurToggleComponent,
    CommonModule,
    DfxCountUp,
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

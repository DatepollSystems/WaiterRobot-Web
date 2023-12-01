import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbInputDatepicker, NgbNavModule, NgbTimepicker, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BarChartModule, LineChartModule, PieChartModule} from '@swimlane/ngx-charts';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCountUp, DfxPrint} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {AppBackButtonComponent} from '../_shared/components/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../_shared/components/scrollable-toolbar.component';
import {AppDatetimeInputComponent} from '../_shared/components/datetime-picker/datetime-picker.component';
import {EntitiesLayout} from '../_shared/layouts/entities.layout';
import {AppSpinnerRowComponent} from '../../_shared/ui/loading/app-spinner-row.component';
import {CountCardComponent} from './components/count-card.component';
import {SumProductGroupsComponent} from './components/sum-product-groups.component';
import {SumProductsPerWaiterComponent} from './components/sum-products-per-waiter.component';
import {SumProductsComponent} from './components/sum-products.component';
import {SumStatisticsComponent} from './components/sum/sum-statistics.component';
import {TimelineComponent} from './components/timeline.component';
import {StatisticsOverviewComponent} from './statistics-overview.component';
import {StatisticsComponent} from './statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    children: [
      {path: 'overview', component: StatisticsOverviewComponent},
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
    ],
  },
  {path: 'products', component: SumProductsComponent},
];

@NgModule({
  declarations: [
    CountCardComponent,
    StatisticsComponent,
    StatisticsOverviewComponent,
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
    CommonModule,
    DfxCountUp,
    DfxPaginationModule,
    DfxPrint,
    DfxSortModule,
    DfxTableModule,
    DfxTranslateModule,
    EntitiesLayout,
    LineChartModule,
    NgbDropdownModule,
    NgbInputDatepicker,
    NgbNavModule,
    NgbTimepicker,
    NgbTooltipModule,
    PieChartModule,
    ReactiveFormsModule,
    ScrollableToolbarComponent,
  ],
})
export class StatisticsModule {}

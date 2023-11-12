import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbInputDatepicker, NgbNavModule, NgbTimepicker, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BarChartModule, LineChartModule, PieChartModule} from '@swimlane/ngx-charts';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxCountUp, DfxPrint, DfxTrackById} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppBackButtonComponent} from '../../_shared/ui/button/app-back-button.component';
import {ScrollableToolbarComponent} from '../../_shared/ui/button/scrollable-toolbar.component';
import {AppDatetimeInputComponent} from '../../_shared/ui/datetime-picker/datetime-picker.component';
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
    canActivate: [organisationSelectedGuard, eventSelectedGuard],
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
    ScrollableToolbarComponent,
    AppDatetimeInputComponent,
    AppEntitiesLayoutComponent,
    BarChartModule,
    BiComponent,
    CommonModule,
    DfxCountUp,
    DfxPaginationModule,
    DfxPrint,
    DfxSortModule,
    DfxTableModule,
    DfxTrackById,
    DfxTranslateModule,
    LineChartModule,
    NgbDropdownModule,
    NgbInputDatepicker,
    NgbNavModule,
    NgbTimepicker,
    NgbTooltipModule,
    PieChartModule,
    ReactiveFormsModule,
  ],
})
export class StatisticsModule {}

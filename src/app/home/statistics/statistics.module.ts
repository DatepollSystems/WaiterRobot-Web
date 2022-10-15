import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BarChartModule, PieChartModule} from '@swimlane/ngx-charts';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';

import {EventSelectedGuard} from '../../_services/guards/event-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/app-entities-layout.component';
import {IconsModule} from '../../_shared/icons.module';
import {StatisticsCountCardComponent} from './count-card/statistics-count-card.component';
import {HomeStatisticsComponent} from './home/home-statistics.component';

import {StatisticsComponent} from './statistics.component';
import {StatisticsSumProductgroupsComponent} from './sum-productgroups/statistics-sum-productgroups.component';
import {SumProductsPerWaiterStatisticsComponent} from './sum-products-per-waiter/sum-products-per-waiter-statistics.component';
import {SumProductsStatisticsComponent} from './sum-products/sum-products-statistics.component';
import {SumStatisticsComponent} from './sum/sum-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    canActivate: [EventSelectedGuard],
    children: [
      {path: 'sum', component: HomeStatisticsComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/statistics/sum'},
    ],
  },
];

@NgModule({
  declarations: [
    StatisticsComponent,
    HomeStatisticsComponent,
    SumStatisticsComponent,
    SumProductsStatisticsComponent,
    SumProductsPerWaiterStatisticsComponent,
    StatisticsCountCardComponent,
    StatisticsSumProductgroupsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbTooltipModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    IconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    PieChartModule,
    NgbNavModule,
    NgbDropdownModule,
    BarChartModule,
  ],
})
export class StatisticsModule {}

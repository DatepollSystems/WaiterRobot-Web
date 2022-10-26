import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NgbDropdownModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BarChartModule, PieChartModule} from '@swimlane/ngx-charts';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';

import {EventSelectedGuard} from '../../_shared/services/guards/event-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {CountUpDirective} from '../../_shared/ui/count-up.directive';
import {IconsModule} from '../../_shared/ui/icons.module';
import {CountCardComponent} from './components/count-card.component';
import {SumProductgroupsComponent} from './components/sum-productgroups.component';
import {SumProductsPerWaiterComponent} from './components/sum-products-per-waiter.component';
import {SumProductsComponent} from './components/sum-products.component';
import {SumStatisticsComponent} from './components/sum/sum-statistics.component';
import {StatisticsOverviewComponent} from './statistics-overview.component';

import {StatisticsComponent} from './statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    canActivate: [EventSelectedGuard],
    children: [
      {path: 'overview', component: StatisticsOverviewComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/statistics/overview'},
    ],
  },
];

@NgModule({
  declarations: [
    StatisticsComponent,
    StatisticsOverviewComponent,
    SumStatisticsComponent,
    SumProductsComponent,
    SumProductsPerWaiterComponent,
    CountCardComponent,
    SumProductgroupsComponent,
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
    CountUpDirective,
  ],
})
export class StatisticsModule {}

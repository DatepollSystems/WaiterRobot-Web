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

import {StatisticsComponent} from './statistics.component';
import {SumProductsStatisticsComponent} from './sum-product-statistics/sum-products-statistics.component';
import {SumStatisticsComponent} from './sum-statistics/sum-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    canActivate: [EventSelectedGuard],
    children: [
      {path: 'sum', component: SumStatisticsComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/statistics/sum'},
    ],
  },
];

@NgModule({
  declarations: [StatisticsComponent, SumStatisticsComponent, SumProductsStatisticsComponent],
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

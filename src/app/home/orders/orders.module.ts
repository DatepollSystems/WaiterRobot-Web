import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {OrdersService} from './_services/orders.service';

import {AllOrdersComponent} from './all-orders/all-orders.component';
import {OrdersComponent} from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [eventSelectedGuard],
    children: [
      {path: 'all', component: AllOrdersComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/orders/all'},
    ],
  },
];

@NgModule({
  declarations: [OrdersComponent, AllOrdersComponent],
  providers: [OrdersService],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    AppIconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
  ],
})
export class OrdersModule {}

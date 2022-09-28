import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDatepickerModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';

import {EventSelectedGuard} from '../../_services/guards/event-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/app-entities-layout.component';

import {IconsModule} from '../../_shared/icons.module';

import {AllOrdersComponent} from './all-orders/all-orders.component';
import {OrdersComponent} from './orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [EventSelectedGuard],
    children: [
      {path: 'all', component: AllOrdersComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/orders/all'},
    ],
  },
];

@NgModule({
  declarations: [OrdersComponent, AllOrdersComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    DfxPaginationModule,
  ],
})
export class OrdersModule {}

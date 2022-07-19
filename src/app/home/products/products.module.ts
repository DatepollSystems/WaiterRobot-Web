import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {IconsModule} from '../../_shared/icons.module';
import {NgbEntityChipInputModule} from '../../_shared/ngb-entity-chip-input/ngb-entity-chip-input.module';
import {OrganisationSelectedGuard} from '../../_services/guards/organisation-selected-guard.service';
import {EventSelectedGuardService} from '../../_services/guards/event-selected-guard.service';

import {ProductsComponent} from './products.component';
import {AllProductsComponent} from './all-products/all-products.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductGroupsComponent} from './product-groups/product-groups.component';
import {ProductGroupEditComponent} from './product-group-edit/product-group-edit.component';
import {ProductGroupByIdProductsComponent} from './product-group-by-id-products/product-group-by-id-products.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [OrganisationSelectedGuard, EventSelectedGuardService],
    component: ProductsComponent,
    children: [
      {path: 'all', component: AllProductsComponent},
      {path: ':id', component: ProductEditComponent},
      {path: 'groups/all', component: ProductGroupsComponent},
      {path: 'groups/create', component: ProductGroupEditComponent},
      {path: 'groups/products/:id', component: ProductGroupByIdProductsComponent},
      {path: 'groups/:id', component: ProductGroupEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/products/all'},
    ],
  },
];

@NgModule({
  declarations: [
    ProductsComponent,
    AllProductsComponent,
    ProductEditComponent,
    ProductGroupsComponent,
    ProductGroupEditComponent,
    ProductGroupByIdProductsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    DfxTrackByModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    NgbEntityChipInputModule,
  ],
})
export class ProductsModule {}

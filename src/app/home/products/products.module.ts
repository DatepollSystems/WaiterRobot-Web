import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';

import {EventSelectedGuard} from '../../_shared/services/guards/event-selected-guard.service';
import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {ChipInput} from '../../_shared/ui/chip-input/chip-input.component';
import {IconsModule} from '../../_shared/ui/icons.module';

import {AllProductsComponent} from './all-products/all-products.component';
import {ProductEditComponent} from './product-edit/product-edit.component';
import {ProductGroupByIdProductsComponent} from './product-group-by-id-products/product-group-by-id-products.component';
import {ProductGroupEditComponent} from './product-group-edit/product-group-edit.component';
import {ProductGroupsComponent} from './product-groups/product-groups.component';
import {ProductsComponent} from './products.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {AllergensService} from './_services/allergens.service';
import {ProductsService} from './_services/products.service';
import {ProductGroupsService} from './_services/product-groups.service';
import {PrintersService} from '../printers/_services/printers.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [OrganisationSelectedGuard, EventSelectedGuard],
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
  providers: [AllergensService, ProductsService, ProductGroupsService, PrintersService],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    DfxTrackByModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    ChipInput,
    AppSpinnerRowComponent,
  ],
})
export class ProductsModule {}

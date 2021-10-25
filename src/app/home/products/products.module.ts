import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTableModule, NgbSortModule} from 'dfx-bootstrap-table';

import {IconsModule} from '../../_shared/icons.module';

import {ProductsComponent} from './products.component';
import {AllProductsComponent} from './all-products/all-products.component';
import {ProductEditComponent} from './product-edit/product-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {path: 'all', component: AllProductsComponent},
      {path: ':id', component: ProductEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/products/all'},
    ],
  },
];

@NgModule({
  declarations: [ProductsComponent, AllProductsComponent, ProductEditComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    NgbTooltipModule,
    NgbNavModule,
    DfxTableModule,
    NgbSortModule,
    IconsModule,
  ],
})
export class ProductsModule {}

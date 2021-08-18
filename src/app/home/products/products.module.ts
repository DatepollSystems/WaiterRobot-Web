import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';

import {ProductsComponent} from './products.component';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AllProductsComponent } from './all-products/all-products.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import {SortableHeaderModule} from '../../_helper/table-sortable';

const startRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {path: 'all', component: AllProductsComponent},
      {path: ':id', component: ProductEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/products/all'}
    ]
  },
];

@NgModule({
  declarations: [ProductsComponent, AllProductsComponent, ProductEditComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, SortableHeaderModule, IconsModule, NgbTooltipModule, FormsModule, ReactiveFormsModule, NgbNavModule]
})
export class ProductsModule {
}

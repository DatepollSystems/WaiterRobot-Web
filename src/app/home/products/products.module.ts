import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';

import {ProductsComponent} from './products.component';

const startRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
];

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, IconsModule],
})
export class ProductsModule {
}

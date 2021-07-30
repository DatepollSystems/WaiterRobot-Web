import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';

import {TablesComponent} from './tables.component';

const startRoutes: Routes = [
  {
    path: '',
    component: TablesComponent
  },
];

@NgModule({
  declarations: [TablesComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, IconsModule],
})
export class TablesModule {
}

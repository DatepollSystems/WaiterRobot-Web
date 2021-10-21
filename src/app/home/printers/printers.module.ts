import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_shared/icons.module';

import {PrintersComponent} from './printers.component';

const startRoutes: Routes = [
  {
    path: '',
    component: PrintersComponent,
  },
];

@NgModule({
  declarations: [PrintersComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, IconsModule],
})
export class PrintersModule {}

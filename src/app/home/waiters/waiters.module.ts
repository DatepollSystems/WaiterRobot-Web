import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';

import {WaitersComponent} from './waiters.component';

const startRoutes: Routes = [
  {
    path: '',
    component: WaitersComponent
  },
];

@NgModule({
  declarations: [WaitersComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, IconsModule],
})
export class WaitersModule {
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DfxTranslateModule} from 'dfx-translate';

import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './start.component';

const startRoutes: Routes = [{path: '', component: StartComponent}];

@NgModule({
  declarations: [StartComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes)],
})
export class StartModule {}

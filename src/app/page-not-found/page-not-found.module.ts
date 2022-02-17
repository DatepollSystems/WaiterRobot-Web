import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';

import {PageNotFoundComponent} from './page-not-found.component';

const routes: Routes = [{path: '', component: PageNotFoundComponent}];

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [RouterModule.forChild(routes), CommonModule, DfxTranslateModule],
})
export class PageNotFoundModule {}

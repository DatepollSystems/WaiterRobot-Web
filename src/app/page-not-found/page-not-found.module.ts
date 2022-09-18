import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';
import {AppLogoWithTextComponent} from '../_shared/app-logo-with-text.component';
import {FooterModule} from '../_shared/footer/footer.module';

import {PageNotFoundComponent} from './page-not-found.component';

const routes: Routes = [{path: '', component: PageNotFoundComponent}];

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [RouterModule.forChild(routes), CommonModule, DfxTranslateModule, FlexModule, AppLogoWithTextComponent, FooterModule],
})
export class PageNotFoundModule {}

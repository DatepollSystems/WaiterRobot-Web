import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {ImprintComponent} from './info/imprint/imprint.component';
import {InfoComponent} from './info/info.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {FooterComponent} from './footer.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

const routes: Routes = [
  {
    path: 'info',
    component: InfoComponent,
    children: [
      {path: 'imprint', component: ImprintComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent},
    ],
  },
];

@NgModule({
  declarations: [FooterComponent, AboutModalComponent, InfoComponent, ImprintComponent, PrivacyPolicyComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, FlexLayoutModule, DfxTranslateModule],
  exports: [FooterComponent],
})
export class FooterModule {}

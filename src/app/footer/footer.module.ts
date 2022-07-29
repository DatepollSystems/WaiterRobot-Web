import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';
import {FooterComponent} from './footer.component';

import {ImprintComponent} from './info/imprint/imprint.component';
import {InfoComponent} from './info/info.component';
import {MobilePrivacyPolicyComponent} from './info/mobile-privacy-policy/mobile-privacy-policy.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

const routes: Routes = [
  {
    path: 'info',
    component: InfoComponent,
    children: [
      {path: 'imprint', title: 'Imprint', component: ImprintComponent},
      {path: 'privacypolicy', title: 'Privacy policy', component: PrivacyPolicyComponent},
      {path: 'mobile-privacypolicy', title: 'Privacy policy', component: MobilePrivacyPolicyComponent},
    ],
  },
];

@NgModule({
  declarations: [
    FooterComponent,
    AboutModalComponent,
    InfoComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    MobilePrivacyPolicyComponent,
  ],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, FlexLayoutModule, DfxTranslateModule],
  exports: [FooterComponent],
})
export class FooterModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';

import {FooterModule} from '../_shared/footer/footer.module';

import {ImprintComponent} from './imprint/imprint.component';
import {InfoComponent} from './info.component';
import {MobilePrivacyPolicyComponent} from './mobile-privacy-policy/mobile-privacy-policy.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: InfoComponent,
    children: [
      {path: 'imprint', title: 'ABOUT_IMPRINT', component: ImprintComponent},
      {path: 'privacypolicy', title: 'ABOUT_PRIVACY_POLICY', component: PrivacyPolicyComponent},
      {path: 'mobile-privacypolicy', title: 'ABOUT_PRIVACY_POLICY', component: MobilePrivacyPolicyComponent},
    ],
  },
];

@NgModule({
  declarations: [InfoComponent, ImprintComponent, PrivacyPolicyComponent, MobilePrivacyPolicyComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, DfxTranslateModule, FooterModule],
})
export class InfoModule {}

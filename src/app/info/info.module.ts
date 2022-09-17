import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {DfxTranslateModule} from 'dfx-translate';

import {ImprintComponent} from './imprint/imprint.component';
import {InfoComponent} from './info.component';
import {MobilePrivacyPolicyComponent} from './mobile-privacy-policy/mobile-privacy-policy.component';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';
import {FooterModule} from '../_shared/footer/footer.module';

const routes: Routes = [
  {
    path: '',
    component: InfoComponent,
    children: [
      {path: 'imprint', title: 'Imprint', component: ImprintComponent},
      {path: 'privacypolicy', title: 'Privacy policy', component: PrivacyPolicyComponent},
      {path: 'mobile-privacypolicy', title: 'Privacy policy', component: MobilePrivacyPolicyComponent},
    ],
  },
];

@NgModule({
  declarations: [InfoComponent, ImprintComponent, PrivacyPolicyComponent, MobilePrivacyPolicyComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, FlexLayoutModule, DfxTranslateModule, FooterModule],
})
export class InfoModule {}

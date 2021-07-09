import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {InfoComponent} from './info/info.component';
import {ImprintComponent} from './info/imprint/imprint.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';

const footerRoutes: Routes = [
  {
    path: 'info',
    component: InfoComponent,
    children: [
      {path: 'imprint', component: ImprintComponent},
      {path: 'privacypolicy', component: PrivacyPolicyComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(footerRoutes)],
  exports: [RouterModule]
})
export class FooterRoutingModule {}

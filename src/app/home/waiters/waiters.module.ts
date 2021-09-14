import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../../_helper/icons.module';
import {SortableHeaderModule} from '../../_helper/table-sortable';

import {QRCodeModal, WaitersComponent} from './waiters.component';
import {OrganisationWaitersComponent} from './organisation-waiters/organisation-waiters.component';
import {QrCodeModule} from 'ng-qrcode';

const waiterRoutes: Routes = [
  {
    path: '',
    component: WaitersComponent,
    children: [
      {path: 'organisation', component: OrganisationWaitersComponent},
      //{path: 'event/:id', component: UserEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/waiters/organisation'}
    ]
  },
];

@NgModule({
  declarations: [WaitersComponent, OrganisationWaitersComponent, QRCodeModal],
  imports: [
    CommonModule,
    FlexLayoutModule,
    DfxTranslateModule,
    NgbTooltipModule,
    IconsModule,
    FormsModule,
    ReactiveFormsModule,
    SortableHeaderModule,
    QrCodeModule,
    RouterModule.forChild(waiterRoutes)
  ],
})
export class WaitersModule {
}

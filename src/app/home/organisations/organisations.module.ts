import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxPaginationModule, DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackByModule} from 'dfx-helper';

import {DfxTranslateModule} from 'dfx-translate';
import {AppQrCodeScannerModalModule} from '../../_shared/app-qr-code-scanner-modal/app-qr-code-scanner-modal.module';

import {IconsModule} from '../../_shared/icons.module';
import {NgbChipInputModule} from '../../_shared/ngb-chip-input/ngb-chip-input.module';
import {SelectableButtonModule} from '../../_shared/selectable-button/selectable-button.module';
import {AllOrganisationsComponent} from './all-organisations/all-organisations.component';
import {OrganisationEditComponent} from './organisation-edit/organisation-edit.component';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal/organisation-user-add-modal.component';

import {OrganisationsComponent} from './organisations.component';

const routes: Routes = [
  {
    path: '',
    component: OrganisationsComponent,
    children: [
      {path: 'all', component: AllOrganisationsComponent},
      {path: ':id', component: OrganisationEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/organisations/all'},
    ],
  },
];

@NgModule({
  declarations: [OrganisationsComponent, OrganisationEditComponent, AllOrganisationsComponent, OrganisationUserAddModalComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DfxTranslateModule,
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    DfxTrackByModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbChipInputModule,
    IconsModule,
    SelectableButtonModule,
    AppQrCodeScannerModalModule,
  ],
})
export class OrganisationsModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {NgbCollapseModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {IconsModule} from '../../_shared/icons.module';

import {OrganisationsComponent} from './organisations.component';
import {AllOrganisationsComponent} from './all-organisations/all-organisations.component';
import {OrganisationEditComponent} from './organisation-edit/organisation-edit.component';
import {SelectableButtonModule} from '../../_shared/selectable-button/selectable-button.module';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal/organisation-user-add-modal.component';
import {NgbChipInputModule} from '../../_shared/ngb-chip-input/ngb-chip-input.module';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

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
    NgbNavModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    NgbCollapseModule,
    SelectableButtonModule,
    ZXingScannerModule,
    NgbChipInputModule,
  ],
})
export class OrganisationsModule {}

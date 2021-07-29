import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {SortableHeaderModule} from '../../_helper/table-sortable';
import {IconsModule} from '../../_helper/icons.module';

import {OrganisationsComponent} from './organisations.component';
import {AllOrganisationsComponent} from './all-organisations/all-organisations.component';
import {OrganisationEditComponent} from './organisation-edit/organisation-edit.component';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

const startRoutes: Routes = [
  {
    path: '',
    component: OrganisationsComponent,
    children: [
      {path: 'all', component: AllOrganisationsComponent},
      {path: ':id', component: OrganisationEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/organisations/all'}
    ],
  },
];

@NgModule({
  declarations: [OrganisationsComponent, OrganisationEditComponent, AllOrganisationsComponent],
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, SortableHeaderModule, IconsModule, NgbNavModule, FormsModule],
})
export class OrganisationsModule {
}

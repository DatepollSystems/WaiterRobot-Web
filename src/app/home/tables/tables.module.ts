import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {EventSelectedGuardService} from '../../_services/guards/event-selected-guard.service';
import {OrganisationSelectedGuard} from '../../_services/guards/organisation-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/app-btn-toolbar/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/app-entities-layout.component';

import {IconsModule} from '../../_shared/icons.module';
import {AllTablesComponent} from './all-tables/all-tables.component';
import {TableEditComponent} from './table-edit/table-edit.component';
import {TableGroupByIdTablesComponent} from './table-group-by-id-tables/table-group-by-id-tables.component';
import {TableGroupEditComponent} from './table-group-edit/table-group-edit.component';
import {TableGroupsComponent} from './table-groups/table-groups.component';

import {TablesComponent} from './tables.component';

const routes: Routes = [
  {
    path: '',
    component: TablesComponent,
    canActivate: [OrganisationSelectedGuard, EventSelectedGuardService],
    children: [
      {path: 'all', component: AllTablesComponent},
      {path: ':id', component: TableEditComponent},
      {path: 'groups/all', component: TableGroupsComponent},
      {path: 'groups/create', component: TableGroupEditComponent},
      {path: 'groups/tables/:id', component: TableGroupByIdTablesComponent},
      {path: 'groups/:id', component: TableGroupEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/tables/all'},
    ],
  },
];

@NgModule({
  declarations: [
    TablesComponent,
    TableGroupsComponent,
    AllTablesComponent,
    TableGroupEditComponent,
    TableEditComponent,
    TableGroupByIdTablesComponent,
  ],
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
    DfxTranslateModule,
    DfxTrackByModule,
    IconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
  ],
})
export class TablesModule {}

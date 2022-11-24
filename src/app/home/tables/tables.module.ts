import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxAutofocus, DfxTrackByModule} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {EventSelectedGuard} from '../../_shared/services/guards/event-selected-guard.service';
import {OrganisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard.service';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

import {AppIconsModule} from '../../_shared/ui/icons.module';
import {QuestionDialogModule} from '../../_shared/ui/question-dialog/question-dialog.module';
import {AllTablesComponent} from './all-tables/all-tables.component';
import {TableEditComponent} from './table-edit/table-edit.component';
import {TableGroupByIdTablesComponent} from './table-group-by-id-tables/table-group-by-id-tables.component';
import {TableGroupEditComponent} from './table-group-edit/table-group-edit.component';
import {TableGroupsComponent} from './table-groups/table-groups.component';

import {TablesComponent} from './tables.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {TablesService} from './_services/tables.service';
import {TableGroupsService} from './_services/table-groups.service';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';

const routes: Routes = [
  {
    path: '',
    component: TablesComponent,
    canActivate: [OrganisationSelectedGuard, EventSelectedGuard],
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
    DfxTranslateModule,
    NgbNavModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    DfxTranslateModule,
    DfxTrackByModule,
    DfxAutofocus,
    AppIconsModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    QuestionDialogModule,
    AppSpinnerRowComponent,
    AppBtnModelEditConfirmComponent,
  ],
  providers: [TablesService, TableGroupsService],
})
export class TablesModule {}

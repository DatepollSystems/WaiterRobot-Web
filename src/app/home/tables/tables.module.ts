import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {SortableHeaderModule} from '../../_helper/table-sortable';
import {IconsModule} from '../../_helper/icons.module';

import {TablesComponent} from './tables.component';
import {TableGroupsComponent} from './table-groups/table-groups.component';
import {AllTablesComponent} from './all-tables/all-tables.component';
import {TableGroupEditComponent} from './table-group-edit/table-group-edit.component';
import {TableEditComponent} from './table-edit/table-edit.component';

const startRoutes: Routes = [
  {
    path: '',
    component: TablesComponent,
    children: [
      {path: 'all', component: AllTablesComponent},
      {path: ':id', component: TableEditComponent},
      {path: 'groups/all', component: TableGroupsComponent},
      {path: 'groups/create', component: TableGroupEditComponent},
      {path: 'groups/:id', component: TableGroupEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/tables/all'},
    ],
  },
];

@NgModule({
  declarations: [TablesComponent, TableGroupsComponent, AllTablesComponent, TableGroupEditComponent, TableEditComponent],
  imports: [
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(startRoutes),
    FlexLayoutModule,
    IconsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTooltipModule,
    SortableHeaderModule,
  ],
})
export class TablesModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';
import {DfxTableModule, NgbSortModule} from 'dfx-bootstrap-table';

import {IconsModule} from '../../_shared/icons.module';

import {UsersComponent} from './users.component';
import {AllUsersComponent} from './all-users/all-users.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {path: 'all', component: AllUsersComponent},
      {path: ':id', component: UserEditComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/users/all'},
    ],
  },
];

@NgModule({
  declarations: [UsersComponent, UserEditComponent, AllUsersComponent],
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
    NgbSortModule,
    IconsModule,
  ],
})
export class UsersModule {}

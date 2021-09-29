import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {IconsModule} from '../../_helper/icons.module';

import {UsersComponent} from './users.component';
import {AllUsersComponent} from './all-users/all-users.component';
import {UserEditComponent} from './user-edit/user-edit.component';
import {SortableHeaderModule} from '../../_helper/table-sortable';
import {NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const userRoutes: Routes = [
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
    CommonModule,
    DfxTranslateModule,
    RouterModule.forChild(userRoutes),
    FlexLayoutModule,
    IconsModule,
    SortableHeaderModule,
    NgbNavModule,
    FormsModule,
    NgbTooltipModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}

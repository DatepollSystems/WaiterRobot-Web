import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NgbDatepickerModule, NgbNavModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTranslateModule} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/ui/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

import {AppIconsModule} from '../../_shared/ui/icons.module';
import {AllUsersComponent} from './all-users/all-users.component';
import {UserEditComponent} from './user-edit/user-edit.component';

import {UsersComponent} from './users.component';
import {AppSpinnerRowComponent} from '../../_shared/ui/app-spinner-row.component';
import {UsersService} from './_services/users.service';
import {AppBtnModelEditConfirmComponent} from '../../_shared/ui/app-btn-model-edit-confirm.component';

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
  providers: [UsersService],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DfxTableModule,
    DfxSortModule,
    DfxTranslateModule,
    NgbNavModule,
    NgbTooltipModule,
    AppIconsModule,
    NgbDatepickerModule,
    AppEntitiesLayoutComponent,
    AppBtnToolbarComponent,
    AppSpinnerRowComponent,
    AppBtnModelEditConfirmComponent,
  ],
})
export class UsersModule {}

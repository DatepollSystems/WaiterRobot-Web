import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';

import {DfxTranslateModule} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../_shared/app-btn-toolbar.component';
import {AppEntitiesLayoutComponent} from '../../_shared/app-entities-layout.component';
import {AppSpinnerRowComponent} from '../../_shared/app-spinner-row.component';

import {IconsModule} from '../../_shared/icons.module';
import {SessionsComponent} from './sessions/sessions.component';
import {UserSettingsSubComponent} from './user-settings-sub/user-settings-sub.component';

import {UserSettingsComponent} from './user-settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsComponent,
    children: [
      {path: 'settings', component: UserSettingsSubComponent},
      {path: 'sessions', title: 'NAV_USER_SESSIONS', component: SessionsComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/usettings/settings'},
    ],
  },
];

@NgModule({
  declarations: [UserSettingsComponent, UserSettingsSubComponent, SessionsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    FormsModule,
    AppBtnToolbarComponent,
    AppEntitiesLayoutComponent,
    AppSpinnerRowComponent,
  ],
})
export class UserSettingsModule {}

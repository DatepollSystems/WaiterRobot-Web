import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {IconsModule} from '../../_shared/icons.module';

import {UserSettingsComponent} from './user-settings.component';
import {UserSettingsSubComponent} from './user-settings-sub/user-settings-sub.component';
import {SessionsComponent} from './sessions/sessions.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsComponent,
    children: [
      {path: 'settings', component: UserSettingsSubComponent},
      {path: 'sessions', component: SessionsComponent},
      {path: '', pathMatch: 'full', redirectTo: '/home/usettings/settings'},
    ],
  },
];

@NgModule({
  declarations: [UserSettingsComponent, UserSettingsSubComponent, SessionsComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DfxTranslateModule,
    NgbTooltipModule,
    DfxTableModule,
    DfxSortModule,
    IconsModule,
    FormsModule,
  ],
})
export class UserSettingsModule {}

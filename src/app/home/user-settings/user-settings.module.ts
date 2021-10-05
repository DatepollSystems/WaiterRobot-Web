import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {DfxTranslateModule} from 'dfx-translate';

import {SortableHeaderModule} from '../../_helper/table-sortable';

import {UserSettingsComponent} from './user-settings.component';
import {UserSettingsSubComponent} from './user-settings-sub/user-settings-sub.component';
import {SessionsComponent} from './sessions/sessions.component';
import {IconsModule} from '../../_helper/icons.module';

const startRoutes: Routes = [
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
  imports: [CommonModule, DfxTranslateModule, RouterModule.forChild(startRoutes), FlexLayoutModule, SortableHeaderModule, IconsModule],
})
export class UserSettingsModule {}

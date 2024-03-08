import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {EntitiesLayout} from '../_shared/layouts/entities.layout';

@Component({
  template: `
    <entities-layout>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="settings" routerLinkActive="active">
          <bi name="gear-wide-connected" />
          {{ 'NAV_USER_SETTINGS' | transloco }}</a
        >
        <a class="list-group-item list-group-item-action" routerLink="sessions" routerLinkActive="active">
          <bi name="file-lock" />
          {{ 'NAV_USER_SESSIONS' | transloco }}</a
        >
      </div>
    </entities-layout>
  `,
  selector: 'app-user-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoPipe, EntitiesLayout, BiComponent],
  standalone: true,
})
export class UserSettingsLayout {}

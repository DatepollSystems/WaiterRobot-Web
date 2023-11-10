import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="settings" routerLinkActive="active">
          <bi name="gear-wide-connected" />
          {{ 'NAV_USER_SETTINGS' | tr }}</a
        >
        <a class="list-group-item list-group-item-action" routerLink="sessions" routerLinkActive="active">
          <bi name="file-lock" />
          {{ 'NAV_USER_SESSIONS' | tr }}</a
        >
      </div>
    </entities-layout-component>
  `,
  selector: 'app-user-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, AppEntitiesLayoutComponent, BiComponent],
  standalone: true,
})
export class UserSettingsComponent {}

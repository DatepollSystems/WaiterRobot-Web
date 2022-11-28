import {Component} from '@angular/core';
import {NgxBootstrapIconsModule} from 'ngx-bootstrap-icons';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="settings" routerLinkActive="active">
          <i-bs name="gear-wide-connected"></i-bs>
          {{ 'NAV_USER_SETTINGS' | tr }}</a
        >
        <a class="list-group-item list-group-item-action" routerLink="sessions" routerLinkActive="active">
          <i-bs name="file-lock"></i-bs>
          {{ 'NAV_USER_SESSIONS' | tr }}</a
        >
      </div>
    </entities-layout-component>
  `,
  selector: 'app-user-settings',
  imports: [NgxBootstrapIconsModule, RouterLink, RouterLinkActive, DfxTr, AppEntitiesLayoutComponent],
  standalone: true,
})
export class UserSettingsComponent {}

import {Component} from '@angular/core';
import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="people-fill"></i-bs>
          {{ 'HOME_USERS_ALL' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="/home/users/create" routerLinkActive="active">
          <i-bs name="plus-circle"></i-bs>
          {{ 'ADD_2' | tr }}</a
        >
      </div>
    </entities-layout-component>
  `,
  selector: 'app-users',
  imports: [AppEntitiesLayoutComponent, AppIconsModule, DfxTr, RouterLink, RouterLinkActive],
  standalone: true,
})
export class UsersComponent {}

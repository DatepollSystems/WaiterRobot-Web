import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';
import {getOrderBySelected} from '../../_shared/services/getOrderBySelected';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {OrganisationsService} from './_services/organisations.service';

@Component({
  selector: 'app-organisations',
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="building"></i-bs>
          {{ 'HOME_ORGS_ALL' | tr }}</a
        >

        <app-list-nav-items path="/home/organisations/" [entities]="organisations$ | async"></app-list-nav-items>
      </div>
    </entities-layout-component>
  `,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
  standalone: true,
})
export class OrganisationsComponent {
  organisations$ = getOrderBySelected(inject(OrganisationsService));
}

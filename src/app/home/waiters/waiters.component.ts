import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {getEventsOrderedBySelected} from '../events/_services/getEventsOrderedBySelected';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a
          *ngIf="selectedOrganisation$ | async as selectedOrganisation"
          class="list-group-item list-group-item-action"
          routerLink="organisation"
          routerLinkActive="active"
        >
          <i-bs name="people" />
          {{ selectedOrganisation.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</a
        >

        <app-list-nav-items path="/home/waiters/event/" [entities]="events$ | async" />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, NgIf, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
})
export class WaitersComponent {
  selectedOrganisation$ = inject(OrganisationsService).getSelected$;

  events$ = getEventsOrderedBySelected();
}

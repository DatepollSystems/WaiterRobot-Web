import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {getEventsOrderedBySelected} from '../events/_services/getEventsOrderedBySelected';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          <a
            *ngIf="selectedOrganisation$ | async as selectedOrganisation"
            class="list-group-item list-group-item-action"
            routerLink="organisation"
            routerLinkActive="active"
          >
            <bi name="people" />
            {{ selectedOrganisation.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</a
          >
        </div>
        <app-list-nav-items path="/home/waiters/event/" [entities]="events$ | async" titleTr="NAV_EVENTS" selectTr="HOME_EVENTS_SELECT" />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, NgIf, DfxTr, BiComponent, AppEntitiesLayoutComponent, AppListNavItemsComponent],
})
export class WaitersComponent {
  selectedOrganisation$ = inject(OrganisationsService).getSelected$;

  events$ = getEventsOrderedBySelected();
}

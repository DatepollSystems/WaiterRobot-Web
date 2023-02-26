import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {EventsService} from '../events/_services/events.service';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a
          *ngIf="selectedOrganisation$ | async as selectedOrganisation"
          class="list-group-item list-group-item-action"
          routerLink="organisation"
          routerLinkActive="active">
          <i-bs name="people" />
          {{ selectedOrganisation.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | tr }}</a
        >

        <a
          *ngIf="selectedEvent$ | async as selectedEvent"
          class="list-group-item list-group-item-action"
          routerLink="event/{{ selectedEvent.id }}"
          routerLinkActive="active">
          <i-bs name="people" />
          {{ selectedEvent.name }} {{ 'HOME_WAITERS_NAV_EVENTS' | tr }}</a
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
  selectedEvent$ = this.eventsService.getSelected$;

  events$ = this.eventsService.getAll$();

  constructor(private eventsService: EventsService) {}
}

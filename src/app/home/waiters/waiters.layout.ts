import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {AppListNavItemsComponent} from '../_shared/layouts/app-list-nav-items.component';
import {EntitiesLayout} from '../_shared/layouts/entities.layout';
import {getEventsOrderedBySelected} from '../events/_services/getEventsOrderedBySelected';
import {SelectedOrganisationService} from '../organisations/_services/selected-organisation.service';

@Component({
  template: `
    <entities-layout>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          @if (selectedOrganisation(); as selectedOrganisation) {
            <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
              <bi name="people" />
              {{ selectedOrganisation.name }} {{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}</a
            >
          }
        </div>
        <app-list-nav-items path="event/" titleTr="NAV_EVENTS" selectTr="HOME_EVENTS_SELECT" [entities]="events$ | async" />
      </div>
    </entities-layout>
  `,
  selector: 'app-waiters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, TranslocoPipe, BiComponent, EntitiesLayout, AppListNavItemsComponent],
})
export class WaitersLayout {
  selectedOrganisation = inject(SelectedOrganisationService).selected;

  events$ = getEventsOrderedBySelected();
}

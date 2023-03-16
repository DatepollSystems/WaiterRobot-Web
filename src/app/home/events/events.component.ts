import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {getEventsOrderedBySelected} from './_services/getEventsOrderedBySelected';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="calendar-event-fill" />
          {{ 'NAV_EVENTS' | tr }}
        </a>

        <app-list-nav-items path="/home/events/" [entities]="events$ | async" />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent],
})
export class EventsComponent {
  events$ = getEventsOrderedBySelected();
}

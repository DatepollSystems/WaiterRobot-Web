import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterOutlet} from '@angular/router';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {injectParams} from 'ngxtension/inject-params';

import {EventsService} from '../_admin/events/_services/events.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul class="nav-tabs mb-3" [activeId]="activeId()" ngbNav>
        <li ngbNavItem="all">
          <a ngbNavLink routerLink="../all">{{ 'ALL' | transloco }}</a>
        </li>
        @for (event of events(); track event.id) {
          <li [ngbNavItem]="event.id.toString()">
            <a [routerLink]="'../' + event.id" ngbNavLink>
              {{ event.name }}
            </a>
          </li>
        }
      </ul>
    </div>

    <router-outlet />
  `,
  selector: 'app-tables-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, NgbNav, NgbNavItem, NgbNavLink, RouterOutlet],
})
export class WaitersLayout {
  activeId = injectParams('id');
  events = toSignal(inject(EventsService).getAll$(), {
    initialValue: [],
  });
}

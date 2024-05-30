import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectParams} from 'ngxtension/inject-params';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'NAV_EVENTS' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId()">
        @for (organisations of organisations(); track organisations.id) {
          <li [ngbNavItem]="organisations.id.toString()">
            <a ngbNavLink [routerLink]="'../' + organisations.id">
              {{ organisations.name }}
            </a>
          </li>
        }
      </ul>
    </div>

    <router-outlet />
  `,
  selector: 'app-events-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, NgbNav, NgbNavItem, NgbNavLink, RouterOutlet],
})
export class EventsLayout {
  activeId = injectParams('id');
  organisations = toSignal(inject(OrganisationsService).getAll$(), {
    initialValue: [],
  });
}

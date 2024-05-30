import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {injectParams} from 'ngxtension/inject-params';
import {EventsService} from '../events/_services/events.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_WAITERS_NAV_ORGANISATION' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId()">
        <li ngbNavItem="all">
          <a ngbNavLink routerLink="../all">{{ 'ALL' | transloco }}</a>
        </li>
        @for (event of events(); track event.id) {
          <li [ngbNavItem]="event.id.toString()">
            <a ngbNavLink [routerLink]="'../' + event.id">
              {{ event.name }}
            </a>
          </li>
        }
      </ul>
    </div>

    <router-outlet />
  `,
  selector: 'app-tables-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, NgbNav, NgbNavItem, NgbNavLink, RouterOutlet, AppTextWithColorIndicatorComponent],
})
export class WaitersLayout {
  activeId = injectParams('id');
  events = toSignal(inject(EventsService).getAll$(), {
    initialValue: [],
  });
}

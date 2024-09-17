import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <h1 class="mb-3">{{ 'RECYCLE_BIN' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId">
        <li ngbNavItem="products">
          <a ngbNavLink routerLink="products">{{ 'HOME_PROD_ALL' | transloco }}</a>
        </li>

        <li ngbNavItem="tables">
          <a ngbNavLink routerLink="tables">{{ 'HOME_TABLES' | transloco }}</a>
        </li>

        <li ngbNavItem="waiters">
          <a ngbNavLink routerLink="waiters">{{ 'NAV_WAITERS' | transloco }}</a>
        </li>

        <li ngbNavItem="printers">
          <a ngbNavLink routerLink="printers">{{ 'NAV_PRINTERS' | transloco }}</a>
        </li>
      </ul>
    </div>

    <router-outlet />
  `,
  selector: 'app-printers-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslocoPipe, NgbNav, NgbNavItem, NgbNavLink, RouterOutlet],
})
export class RecycleBinLayout {
  activeId = inject(Router).url.split('/').at(-1)?.split('?')?.at(0);
}

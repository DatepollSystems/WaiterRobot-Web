import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AppAdjustDarkModeColor} from '@home-shared/components/color/app-adjust-dark-mode-color.pipe';
import {AppTextColorByBackgroundDirective} from '@home-shared/components/color/app-text-color-by-background.directive';
import {TranslocoPipe} from '@jsverse/transloco';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {ThemeService} from '@shared/services/theme.service';
import {injectParams} from 'ngxtension/inject-params';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_TABLES' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId()">
        <li ngbNavItem="all">
          <a ngbNavLink routerLinkActive="tab-active" routerLink="../all">{{ 'ALL' | transloco }}</a>
        </li>
        @for (tableGroup of tableGroups(); track tableGroup.id) {
          <li [ngbNavItem]="tableGroup.id.toString()">
            <a
              ngbNavLink
              routerLinkActive="tab-active"
              [routerLink]="'../' + tableGroup.id"
              [style.background-color]="tableGroup.color | adjustDarkModeColor: currentTheme().id"
            >
              <span class="d-flex gap-3 align-items-center" app-text-color-by-background [color]="tableGroup.color">
                {{ tableGroup.name }}

                <span class="badge bg-secondary rounded-pill">{{ tableGroup.tables.length }}</span>
              </span>
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
  imports: [
    RouterLink,
    TranslocoPipe,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    RouterOutlet,
    AppTextColorByBackgroundDirective,
    RouterLinkActive,
    AppAdjustDarkModeColor,
  ],
})
export class TablesLayout {
  activeId = injectParams('id');
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {
    initialValue: [],
  });
  currentTheme = inject(ThemeService).currentTheme;
}

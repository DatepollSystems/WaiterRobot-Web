import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {NgbNav, NgbNavItem, NgbNavLink} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {injectParams} from 'ngxtension/inject-params';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <h1 class="mb-3">{{ 'HOME_TABLES' | transloco }}</h1>

    <div class="nav-x-scroll">
      <ul ngbNav class="nav-tabs mb-3" [activeId]="activeId()">
        <li ngbNavItem="all">
          <a ngbNavLink routerLink="../all">{{ 'ALL' | transloco }}</a>
        </li>
        @for (tableGroup of tableGroups(); track tableGroup.id) {
          <li [ngbNavItem]="tableGroup.id.toString()">
            <a ngbNavLink class="d-flex gap-3 align-items-center" [routerLink]="'../' + tableGroup.id">
              <app-text-with-color-indicator [color]="tableGroup.color">
                {{ tableGroup.name }}
              </app-text-with-color-indicator>

              <div class="d-flex align-items-center">
                <span class="badge bg-secondary rounded-pill">{{ tableGroup.tables.length }}</span>
              </div>
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
export class TablesLayout {
  activeId = injectParams('id');
  tableGroups = toSignal(inject(TableGroupsService).getAll$(), {
    initialValue: [],
  });
}

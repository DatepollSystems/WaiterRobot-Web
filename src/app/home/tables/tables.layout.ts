import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {AppTextWithColorIndicatorComponent} from '@home-shared/components/color/app-text-with-color-indicator.component';
import {AppListNavItemDirective, AppListNavItemsComponent} from '@home-shared/layouts/app-list-nav-items.component';
import {EntitiesLayout} from '@home-shared/layouts/entities.layout';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';

import {BiComponent} from 'dfx-bootstrap-icons';

import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <entities-layout>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <div class="d-flex justify-content-between">
              <div>
                <bi name="columns-gap" />
                {{ 'HOME_TABLES' | transloco }}
              </div>

              <div>
                <span class="badge bg-secondary rounded-pill" placement="left" [ngbTooltip]="'HOME_TABLES_COUNT' | transloco">
                  {{ allTablesAmount() ?? '' }}
                </span>
              </div>
            </div>
          </a>

          <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
            <div class="d-flex justify-content-between">
              <div>
                <bi name="diagram-3" />
                {{ 'HOME_TABLE_GROUPS' | transloco }}
              </div>
              <div>
                <span class="badge bg-secondary rounded-pill" placement="left" [ngbTooltip]="'HOME_TABLE_GROUPS_COUNT' | transloco">
                  {{ tableGroups()?.length ?? '-' }}
                </span>
              </div>
            </div>
          </a>
        </div>
        <app-list-nav-items
          path="groups/tables/"
          titleTr="HOME_TABLE_GROUPS"
          selectTr="HOME_TABLES_GROUPS_SELECT"
          [entities]="tableGroups() ?? []"
        >
          <ng-template let-entity appListNavItem>
            <div class="d-flex justify-content-between">
              <app-text-with-color-indicator [color]="entity.color">
                {{ entity.name }}
              </app-text-with-color-indicator>
              <div>
                <span class="badge bg-secondary rounded-pill" placement="left" [ngbTooltip]="'HOME_TABLES_COUNT' | transloco">{{
                  entity.tables.length
                }}</span>
              </div>
            </div>
          </ng-template>
        </app-list-nav-items>
      </div>
    </entities-layout>
  `,
  selector: 'app-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    BiComponent,
    EntitiesLayout,
    AppListNavItemsComponent,
    AppListNavItemDirective,
    AppTextWithColorIndicatorComponent,
    NgbTooltip,
  ],
})
export class TablesLayout {
  tableGroups = toSignal(inject(TableGroupsService).getAll$());

  allTablesAmount = computed(() =>
    this.tableGroups()
      ?.map((it) => it.tables.length)
      .reduce((current, previous) => current + previous, 0),
  );
}

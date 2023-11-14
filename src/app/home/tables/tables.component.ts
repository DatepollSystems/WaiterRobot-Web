import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink, RouterLinkActive} from '@angular/router';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemDirective, AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppTextWithColorIndicatorComponent} from '../../_shared/ui/color/app-text-with-color-indicator.component';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="d-flex flex-column gap-3" nav>
        <div class="list-group">
          <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
            <div class="d-flex justify-content-between">
              <div>
                <bi name="columns-gap" />
                {{ 'HOME_TABLES' | tr }}
              </div>

              <div>
                <span class="badge bg-secondary rounded-pill" [ngbTooltip]="'HOME_TABLES_COUNT' | tr" placement="right">
                  {{ allTablesAmount() ?? '' }}
                </span>
              </div>
            </div>
          </a>

          <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
            <div class="d-flex justify-content-between">
              <div>
                <bi name="diagram-3" />
                {{ 'HOME_TABLE_GROUPS' | tr }}
              </div>
              <div>
                <span class="badge bg-secondary rounded-pill" [ngbTooltip]="'HOME_TABLE_GROUPS_COUNT' | tr" placement="right">
                  {{ tableGroups()?.length ?? '-' }}
                </span>
              </div>
            </div>
          </a>
        </div>
        <app-list-nav-items
          path="groups/tables/"
          [entities]="tableGroups() ?? []"
          titleTr="HOME_TABLE_GROUPS"
          selectTr="HOME_TABLES_GROUPS_SELECT"
        >
          <ng-template let-entity appListNavItem>
            <div class="d-flex justify-content-between">
              <app-text-with-color-indicator [color]="entity.color">
                {{ entity.name }}
              </app-text-with-color-indicator>
              <div>
                <span class="badge bg-secondary rounded-pill" [ngbTooltip]="'HOME_TABLES_COUNT' | tr" placement="right">{{
                  entity.tables.length
                }}</span>
              </div>
            </div>
          </ng-template>
        </app-list-nav-items>
      </div>
    </entities-layout-component>
  `,
  selector: 'app-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    DfxTr,
    BiComponent,
    AppEntitiesLayoutComponent,
    AppListNavItemsComponent,
    AppListNavItemDirective,
    AppTextWithColorIndicatorComponent,
    NgbTooltip,
  ],
})
export class TablesComponent {
  tableGroups = toSignal(inject(TableGroupsService).getAll$());

  allTablesAmount = computed(
    () =>
      this.tableGroups()
        ?.map((it) => it.tables.length)
        ?.reduce((previous, current) => (current += previous)),
  );
}

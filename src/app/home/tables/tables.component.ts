import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

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
            <bi name="columns-gap" />
            {{ 'HOME_TABLES' | tr }}</a
          >

          <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
            <bi name="diagram-3" />
            {{ 'HOME_TABLE_GROUPS' | tr }}</a
          >
        </div>
        <app-list-nav-items
          path="/home/tables/groups/tables/"
          [entities]="tableGroups$ | async"
          titleTr="HOME_TABLE_GROUPS"
          selectTr="HOME_TABLES_GROUPS_SELECT"
        >
          <ng-template let-entity appListNavItem>
            <app-text-with-color-indicator [color]="entity.color">
              {{ entity.name }}
            </app-text-with-color-indicator>
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
    AsyncPipe,
    AppListNavItemDirective,
    AppTextWithColorIndicatorComponent,
  ],
})
export class TablesComponent {
  tableGroups$ = inject(TableGroupsService).getAll$();
}

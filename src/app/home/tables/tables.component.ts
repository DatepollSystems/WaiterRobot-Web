import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DfxTr} from 'dfx-translate';

import {AppEntitiesLayoutComponent} from '../../_shared/ui/app-entities-layout.component';
import {AppListNavItemsComponent} from '../../_shared/ui/app-list-nav-items.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {TableGroupsService} from './_services/table-groups.service';

@Component({
  template: `
    <entities-layout-component>
      <div class="list-group" nav>
        <a class="list-group-item list-group-item-action" routerLink="all" routerLinkActive="active">
          <i-bs name="columns-gap" />
          {{ 'HOME_TABLES' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="groups/all" routerLinkActive="active">
          <i-bs name="diagram-3" />
          {{ 'HOME_TABLE_GROUPS' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="/home/tables/create" routerLinkActive="active">
          <i-bs name="plus-circle" />
          {{ 'HOME_TABLES_ADD' | tr }}</a
        >

        <a class="list-group-item list-group-item-action" routerLink="/home/tables/groups/create" routerLinkActive="active">
          <i-bs name="plus-circle" />
          {{ 'HOME_TABLE_GROUPS_ADD' | tr }}</a
        >

        <app-list-nav-items path="/home/tables/groups/tables/" [entities]="tableGroups$ | async" />
      </div>
    </entities-layout-component>
  `,
  selector: 'app-tables',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, DfxTr, AppIconsModule, AppEntitiesLayoutComponent, AppListNavItemsComponent, AsyncPipe],
})
export class TablesComponent {
  tableGroups$ = inject(TableGroupsService).getAll$();
}

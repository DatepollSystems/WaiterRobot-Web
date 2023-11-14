import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {filter, map} from 'rxjs';

import {n_from, n_isNumeric} from 'dfts-helper';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../_shared/ui/form/app-deleted.directives';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateTableDto, GetTableWithGroupResponse, UpdateTableDto} from '../../../_shared/waiterrobot-backend';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';
import {TableEditFormComponent} from './table-edit-form.component';
import {TableEditOrderProductsComponent} from './table-edit-order-products.component';

@Component({
  template: `
    @if (entity$ | async; as entity) {
      <h1 *isCreating="entity">{{ 'HOME_TABLES_ADD' | tr }}</h1>
      <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.group.name }} - {{ entity.number }}</h1>
      <h1 *isEditingAndDeleted="entity">{{ entity.group.name }} - {{ entity.number }} {{ 'DELETED' | tr }}</h1>

      <scrollable-toolbar>
        <back-button />
        <ng-container *isNotDeleted="entity">
          @if ((activeTab$ | async) === 'DATA') {
            <app-model-edit-save-btn (submit)="form?.submit()" [valid]="valid()" [editing]="entity !== 'CREATE'" />
          }
        </ng-container>

        <ng-container *isEditingAndNotDeleted="entity">
          <div>
            <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
              <bi name="trash" />
              {{ 'DELETE' | tr }}
            </button>
          </div>

          <div>
            <button class="btn btn-sm btn-primary" routerLink="/home/tables/groups/tables/{{ entity.groupId }}">
              <bi name="diagram-3" />
              {{ 'HOME_TABLE_GO_TO_GROUP' | tr }}
            </button>
          </div>
        </ng-container>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </scrollable-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            @if ((tableGroups()?.length ?? 1) < 1) {
              <div class="alert alert-warning">
                <a routerLink="../groups/create">{{ 'HOME_TABLE_ADD_GROUP_FIRST' | tr }}</a>
              </div>
            }
            <app-table-edit-form
              #form
              (formValid)="setValid($event)"
              (submitUpdate)="submit('UPDATE', $event)"
              (submitCreate)="submit('CREATE', $event)"
              [tableGroups]="tableGroups() ?? []"
              [selectedEventId]="selectedEventId()!"
              [selectedTableGroupId]="selectedTableGroupId()"
              [table]="entity"
              [formDisabled]="(tableGroups()?.length ?? 1) < 1 || (entity !== 'CREATE' && !!entity.deleted)"
            />
          </ng-template>
        </li>

        <li [ngbNavItem]="'ORDERS'" *isEditing="entity" [destroyOnHide]="true">
          <a ngbNavLink>{{ 'NAV_ORDERS' | tr }}</a>
          <ng-template ngbNavContent>
            <app-table-edit-order-products />
          </ng-template>
        </li>
      </ul>

      <div [ngbNavOutlet]="nav" class="mt-2"></div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-table-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AppFormModule,
    AppContinuesCreationSwitchComponent,
    TableEditFormComponent,
    TableEditOrderProductsComponent,
    AppDeletedDirectives,
  ],
})
export class TableEditComponent extends AbstractModelEditComponent<
  CreateTableDto,
  UpdateTableDto,
  GetTableWithGroupResponse,
  'DATA' | 'ORDERS'
> {
  defaultTab = 'DATA' as const;
  override onlyEditingTabs = ['ORDERS' as const];
  override continuousUsePropertyNames = ['number', 'groupId', 'seats', 'eventId'];

  selectedEventId = inject(SelectedEventService).selectedId;
  tableGroups = toSignal(inject(TableGroupsService).getAll$());
  selectedTableGroupId = toSignal(
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  constructor(tablesService: TablesService) {
    super(tablesService);
  }
}

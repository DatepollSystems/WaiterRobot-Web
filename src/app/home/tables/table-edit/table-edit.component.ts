import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {combineLatest, filter, map, startWith} from 'rxjs';

import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {n_from, n_isNumeric} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../_shared/ui/form/app-deleted.directives';
import {AppFormModule} from '../../../_shared/ui/form/app-form.module';
import {CreateTableDto, GetTableWithGroupResponse, UpdateTableDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';
import {TableEditFormComponent} from './table-edit-form.component';
import {TableEditOrderProductsComponent} from './table-edit-order-products.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isCreating="entity">{{ 'HOME_TABLES_ADD' | tr }}</h1>
      <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.group.name }} {{ entity.number }}</h1>
      <h1 *isEditingAndDeleted="entity">{{ entity.group.name }} - {{ entity.number }} {{ 'DELETED' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <ng-container *isNotDeleted="entity">
          <app-model-edit-save-btn
            *ngIf="(activeTab$ | async) === 'DATA'"
            (submit)="form?.submit()"
            [valid]="valid()"
            [editing]="entity !== 'CREATE'"
          />
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
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs" (navChange)="navigateToTab($event.nextId)">
        <li [ngbNavItem]="'DATA'" [destroyOnHide]="false">
          <a ngbNavLink>{{ 'DATA' | tr }}</a>
          <ng-template ngbNavContent>
            <ng-container *ngIf="vm$ | async as vm">
              <div class="alert alert-warning" *ngIf="vm.tableGroups.length < 1">
                <a routerLink="../groups/create">{{ 'HOME_TABLE_ADD_GROUP_FIRST' | tr }}</a>
              </div>
              <app-table-edit-form
                #form
                (formValid)="setValid($event)"
                (submitUpdate)="submit('UPDATE', $event)"
                (submitCreate)="submit('CREATE', $event)"
                [tableGroups]="vm.tableGroups"
                [selectedEventId]="vm.selectedEvent?.id"
                [selectedTableGroupId]="vm.selectedTableGroupId"
                [table]="entity"
                [formDisabled]="vm.tableGroups.length < 1 || (entity !== 'CREATE' && !!entity.deleted)"
              />
            </ng-container>
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
    </div>

    <ng-template #loading>
      <app-spinner-row />
    </ng-template>
  `,
  selector: 'app-table-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    NgbNavModule,
    DfxTr,
    AppFormModule,
    BiComponent,
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

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      startWith(undefined),
    ),
    this.tableGroupsService.getAll$(),
    this.eventsService.getSelected$,
  ]).pipe(
    map(([selectedTableGroupId, tableGroups, selectedEvent]) => ({
      selectedTableGroupId,
      tableGroups,
      selectedEvent,
    })),
  );

  constructor(
    tablesService: TablesService,
    private eventsService: EventsService,
    private tableGroupsService: TableGroupsService,
  ) {
    super(tablesService);
  }
}

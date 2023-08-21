import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {n_from, n_isNumeric} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {combineLatest, filter, map, startWith} from 'rxjs';
import {AppBackButtonComponent} from '../../../_shared/ui/app-back-button.component';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AbstractModelEditComponent} from '../../../_shared/ui/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../../_shared/ui/form/app-continues-creation-switch.component';
import {AppIsCreatingDirective} from '../../../_shared/ui/form/app-is-creating.directive';
import {AppIsEditingDirective} from '../../../_shared/ui/form/app-is-editing.directive';
import {AppModelEditSaveBtn} from '../../../_shared/ui/form/app-model-edit-save-btn.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {CreateTableDto, GetTableResponse, UpdateTableDto} from '../../../_shared/waiterrobot-backend';

import {EventsService} from '../../events/_services/events.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';
import {TableEditFormComponent} from './table-edit-form.component';
import {TableEditOrderProductsComponent} from './table-edit-order-products.component';

@Component({
  template: `
    <div *ngIf="entity$ | async as entity; else loading">
      <h1 *isEditing="entity">{{ 'EDIT_2' | tr }} {{ entity.number }} ({{ entity.groupName }})</h1>
      <h1 *isCreating="entity">{{ 'HOME_TABLES_ADD' | tr }}</h1>

      <btn-toolbar>
        <back-button />
        <app-model-edit-save-btn
          *ngIf="(activeTab$ | async) === 'DATA'"
          (submit)="form?.submit()"
          [valid]="valid$ | async"
          [editing]="entity !== 'CREATE'"
        />

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-danger" (click)="onDelete(entity.id)">
            <i-bs name="trash" />
            {{ 'DELETE' | tr }}
          </button>
        </div>

        <div *isEditing="entity">
          <button class="btn btn-sm btn-outline-primary" routerLink="/home/tables/groups/tables/{{ entity.groupId }}">
            <i-bs name="diagram-3" />
            {{ 'HOME_TABLE_GO_TO_GROUP' | tr }}
          </button>
        </div>

        <div class="d-flex align-items-center" *isCreating="entity">
          <app-continues-creation-switch (continuesCreationChange)="continuesCreation = $event" />
        </div>
      </btn-toolbar>

      <ul ngbNav #nav="ngbNav" [activeId]="activeTab$ | async" class="nav-tabs bg-dark" (navChange)="navigateToTab($event.nextId)">
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
                [formDisabled]="vm.tableGroups.length < 1"
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

      <div [ngbNavOutlet]="nav" class="mt-2 bg-dark"></div>
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
    AsyncPipe,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    DfxTr,
    DfxTrackById,
    AppSpinnerRowComponent,
    AppIsEditingDirective,
    AppIsCreatingDirective,
    AppBtnToolbarComponent,
    AppIconsModule,
    AppModelEditSaveBtn,
    AppContinuesCreationSwitchComponent,
    TableEditFormComponent,
    RouterLink,
    AppBackButtonComponent,
    TableEditOrderProductsComponent,
  ],
})
export class TableEditComponent extends AbstractModelEditComponent<CreateTableDto, UpdateTableDto, GetTableResponse, 'DATA' | 'ORDERS'> {
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

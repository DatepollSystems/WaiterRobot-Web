import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {filter, map} from 'rxjs';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '@home-shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '@home-shared/form/edit';
import {MobileLinkService} from '@home-shared/services/mobile-link.service';
import {injectOnSubmit} from '@shared/form';
import {GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {n_from, n_isNumeric} from 'dfts-helper';

import {SelectedEventService} from '../../events/_services/selected-event.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';
import {TableEditFormComponent} from './table-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_TABLES_ADD' | tr }}</h1>
        <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.group.name }} - {{ entity.number }}</h1>
        <h1 *isEditingAndDeleted="entity">{{ entity.group.name }} - {{ entity.number }} {{ 'DELETED' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>
            @if (publicIdLink(); as link) {
              <div>
                <a class="btn btn-sm btn-info" [href]="link">
                  <bi name="box-arrow-up-right" />
                  {{ 'HOME_TABLES_PUBLIC_ID' | tr }}
                </a>
              </div>
            }

            <div>
              <a class="btn btn-sm btn-primary" routerLink="../groups/tables/{{ entity.groupId }}">
                <bi name="diagram-3" />
                {{ 'HOME_TABLE_GO_TO_GROUP' | tr }}
              </a>
            </div>

            <div>
              <a class="btn btn-sm btn-outline-secondary text-body-emphasis" routerLink="../../orders" [queryParams]="{tableId: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | tr }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-outline-secondary text-body-emphasis" routerLink="../../bills" [queryParams]="{tableId: entity.id}">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | tr }}
              </a>
            </div>
          </ng-container>

          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        @if ((tableGroups()?.length ?? 1) < 1) {
          <div class="alert alert-warning">
            <a routerLink="../groups/create">{{ 'HOME_TABLE_ADD_GROUP_FIRST' | tr }}</a>
          </div>
        }

        <app-table-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          [tableGroups]="tableGroups() ?? []"
          [selectedEventId]="selectedEventId()!"
          [selectedTableGroupId]="selectedTableGroupId()"
          [table]="entity"
          [formDisabled]="(tableGroups()?.length ?? 1) < 1 || (entity !== 'CREATE' && !!entity.deleted)"
        />
      </div>
    } @else {
      <app-spinner-row />
    }
  `,
  selector: 'app-table-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AppEntityEditModule,
    AppContinuesCreationSwitchComponent,
    TableEditFormComponent,
    AppDeletedDirectives,
    LowerCasePipe,
  ],
})
export class TableEditComponent extends AbstractModelEditComponent<GetTableWithGroupResponse> {
  onDelete = injectOnDelete((it: number) => this.tablesService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['number', 'groupId', 'seats', 'eventId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.tablesService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  ml = inject(MobileLinkService);
  selectedEventId = inject(SelectedEventService).selectedId;
  tableGroups = toSignal(inject(TableGroupsService).getAll$());
  selectedTableGroupId = toSignal(
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  publicIdLink = computed(() => {
    const entity = this.entity();
    if (entity !== 'CREATE' && entity) {
      return this.ml.createTableLink(entity.publicId);
    }
    return undefined;
  });

  constructor(private tablesService: TablesService) {
    super(tablesService);
  }
}

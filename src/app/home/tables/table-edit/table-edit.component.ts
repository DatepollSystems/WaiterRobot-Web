import {LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '@home-shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '@home-shared/form/edit';
import {MobileLinkService} from '@home-shared/services/mobile-link.service';
import {injectOnSubmit} from '@shared/form';
import {GetTableWithGroupResponse} from '@shared/waiterrobot-backend';

import {n_from, n_isNumeric} from 'dfts-helper';

import {filter, map, shareReplay} from 'rxjs';

import {SelectedEventService} from '../../events/_services/selected-event.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TablesService} from '../_services/tables.service';
import {TableEditFormComponent} from './table-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_TABLES_ADD' | transloco }}</h1>
        <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | transloco }} {{ entity.group.name }} - {{ entity.number }}</h1>
        <h1 *isEditingAndDeleted="entity">{{ entity.group.name }} - {{ entity.number }} {{ 'DELETED' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>
            @if (publicIdLink(); as link) {
              <div>
                <a class="btn btn-sm btn-info" [href]="link">
                  <bi name="box-arrow-up-right" />
                  {{ 'HOME_TABLES_PUBLIC_ID' | transloco }}
                </a>
              </div>
            }

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../orders" [queryParams]="{tableIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../../bills" [queryParams]="{tableIds: entity.id}">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | transloco }}
              </a>
            </div>
          </ng-container>

          <div *isCreating="entity" class="d-flex align-items-center">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        @if ((tableGroups()?.length ?? 1) < 1) {
          <div class="alert alert-warning d-flex gap-2">
            <bi name="exclamation-triangle-fill" />
            <a class="link-warning" routerLink="../../../table-groups/create">{{ 'HOME_TABLE_ADD_GROUP_FIRST' | transloco }}</a>
          </div>
        }

        <app-table-edit-form
          #form
          [tableGroups]="tableGroups() ?? []"
          [selectedEventId]="selectedEventId()!"
          [selectedTableGroupId]="selectedTableGroupId()"
          [table]="entity"
          [number]="selectedNumber()"
          [formDisabled]="(tableGroups()?.length ?? 1) < 1 || (entity !== 'CREATE' && !!entity.deleted)"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
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
    dataTransformers: {
      number: (it) => Number(it) + 1,
    },
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

  queryParams = this.route.queryParams.pipe(shareReplay());

  selectedTableGroupId = toSignal(
    this.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  selectedNumber = toSignal(
    this.queryParams.pipe(
      map((params) => params.number as string),
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

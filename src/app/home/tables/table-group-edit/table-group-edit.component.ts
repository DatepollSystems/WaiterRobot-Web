import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '@home-shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '@home-shared/form/edit';
import {injectOnSubmit} from '@shared/form';
import {GetTableGroupResponse} from '@shared/waiterrobot-backend';

import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';
import {TableGroupsService} from '../_services/table-groups.service';
import {TableGroupEditFormComponent} from './table-group-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_TABLE_GROUPS_ADD' | transloco }}</h1>
        <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
        <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />

          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button type="button" class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <div>
              <a class="btn btn-sm btn-primary" [routerLink]="'../../tables/' + entity.id">
                <bi name="columns-gap" />
                {{ 'HOME_TABLE_GROUP_SHOW_TABLES' | transloco }}</a
              >
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../orders" [queryParams]="{tableGroupIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../bills" [queryParams]="{tableGroupIds: entity.id}">
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

        <app-table-group-edit-form
          #form
          [tableGroup]="entity"
          [selectedEventId]="selectedEventId()!"
          [formDisabled]="entity !== 'CREATE' && !!entity.deleted"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-table-group-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppEntityEditModule, TableGroupEditFormComponent, AppContinuesCreationSwitchComponent, AppDeletedDirectives],
})
export class TableGroupEditComponent extends AbstractModelEditComponent<GetTableGroupResponse> {
  onDelete = injectOnDelete((it: number) => this.tableGroupsService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['eventId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.tableGroupsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  selectedEventId = inject(SelectedEventService).selectedId;

  constructor(private tableGroupsService: TableGroupsService) {
    super(tableGroupsService);
  }
}

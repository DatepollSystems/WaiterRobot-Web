import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {AbstractModelEditComponent} from '@home-shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '@home-shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '@home-shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '@home-shared/form/edit';
import {injectOnSubmit} from '@shared/form';
import {GetProductGroupResponse} from '@shared/waiterrobot-backend';

import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductGroupEditFormComponent} from './product-group-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_PROD_GROUPS_ADD' | transloco }}</h1>
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
              <a class="btn btn-sm btn-primary" [routerLink]="'../../products/' + entity.id">
                <bi name="columns-gap" />
                {{ 'HOME_PROD_GROUP_SHOW_PRODUCTS' | transloco }}</a
              >
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../orders" [queryParams]="{productGroupIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../bills" [queryParams]="{productGroupIds: entity.id}">
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

        <app-product-group-edit-form
          #form
          [productGroup]="entity"
          [printers]="printers()"
          [selectedEventId]="selectedEventId()"
          [formDisabled]="entity !== 'CREATE' && !!entity.deleted"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-product-group-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AppEntityEditModule, AppContinuesCreationSwitchComponent, ProductGroupEditFormComponent, AppDeletedDirectives],
})
export class ProductGroupEditComponent extends AbstractModelEditComponent<GetProductGroupResponse> {
  onDelete = injectOnDelete((it: number) => this.productGroupsService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['eventId'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.productGroupsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  printers = toSignal(inject(PrintersService).getAll$(), {initialValue: []});
  selectedEventId = inject(SelectedEventService).selectedId;

  constructor(private productGroupsService: ProductGroupsService) {
    super(productGroupsService);
  }
}

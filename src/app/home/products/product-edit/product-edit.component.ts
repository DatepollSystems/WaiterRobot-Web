import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {filter, map} from 'rxjs';

import {n_from, n_isNumeric} from 'dfts-helper';


import {injectOnSubmit} from '../../../_shared/form';
import {GetProductMaxResponse} from '../../../_shared/waiterrobot-backend';
import {AbstractModelEditComponent} from '../../_shared/form/abstract-model-edit.component';
import {AppContinuesCreationSwitchComponent} from '../../_shared/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../_shared/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '../../_shared/form/app-entity-edit.module';
import {injectContinuousCreation, injectOnDelete} from '../../_shared/form/edit';
import {SelectedEventService} from '../../events/_services/selected-event.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';
import {AppProductEditFormComponent} from './product-edit-form.component';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | tr }}</h1>
        <h1 *isEditingAndNotDeleted="entity">{{ 'EDIT_2' | tr }} {{ entity.name }}</h1>
        <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | tr }}</h1>

        <scrollable-toolbar>
          <back-button />
          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button class="btn btn-sm btn-danger" (click)="onDelete(entity.id)">
                <bi name="trash" />
                {{ 'DELETE' | tr }}
              </button>
            </div>

            <div>
              <a class="btn btn-sm btn-primary" routerLink="../groups/products/{{ entity.group.id }}">
                <bi name="diagram-3" />
                {{ 'HOME_PROD_GO_TO_GROUP' | tr }}
              </a>
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../printers/{{ entity.printer.id }}">
                <bi name="printer" />
                {{ 'NAV_PRINTERS' | tr }} {{ 'OPEN_2' | tr }}
              </a>
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../orders" [queryParams]="{productIds: entity.id}">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | tr }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" routerLink="../../bills" [queryParams]="{productIds: entity.id}">
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

        @if ((productGroups()?.length ?? 1) < 1) {
          @defer (on timer(200)) {
            <div class="alert alert-warning d-flex gap-2">
              <bi name="exclamation-triangle-fill" />
              <a class="link-warning" routerLink="../groups/create">{{ 'HOME_PROD_ADD_GROUP_FIRST' | tr }}</a>
            </div>
          }
        }
        <app-product-edit-form
          #form
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
          [allergens]="allergens()"
          [printers]="printers()"
          [productGroups]="productGroups() ?? []"
          [selectedEventId]="selectedEventId()"
          [selectedProductGroupId]="selectedProductGroupId()"
          [product]="entity"
          [formDisabled]="(productGroups()?.length ?? 1) < 1 || (entity !== 'CREATE' && !!entity.deleted)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'app-product-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, AppEntityEditModule, AppProductEditFormComponent, AppContinuesCreationSwitchComponent, AppDeletedDirectives],
})
export class ProductEditComponent extends AbstractModelEditComponent<GetProductMaxResponse> {
  onDelete = injectOnDelete((it: number) => this.productsService.delete$(it).subscribe());
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['groupId', 'printerId', 'eventId', 'allergenIds'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.productsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  selectedProductGroupId = toSignal(
    this.route.queryParams.pipe(
      map((params) => params.group as string),
      filter(n_isNumeric),
      map((id) => n_from(id)),
    ),
  );

  productGroups = toSignal(inject(ProductGroupsService).getAll$());
  printers = toSignal(inject(PrintersService).getAll$(), {initialValue: []});
  selectedEventId = inject(SelectedEventService).selectedId;
  allergens = toSignal(inject(AllergensService).getAll$(), {initialValue: []});

  constructor(private productsService: ProductsService) {
    super(productsService);
  }
}

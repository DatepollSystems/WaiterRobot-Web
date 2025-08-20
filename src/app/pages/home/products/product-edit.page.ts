import {ChangeDetectionStrategy, Component, computed, inject, numberAttribute, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {injectQueryParams} from 'ngxtension/inject-query-params';

import {UnknownModelEditFormComponent} from '../../../forms/form/abstract-model-edit-form.component';
import {AppContinuesCreationSwitchComponent} from '../../../forms/form/app-continues-creation-switch.component';
import {AppDeletedDirectives} from '../../../forms/form/app-entity-deleted.directives';
import {AppEntityEditModule} from '../../../forms/form/app-entity-edit.module';
import {injectContinuousCreation, injectEditEntity, injectOnDelete} from '../../../forms/form/edit';
import {AppProductEditFormComponent} from '../../../forms/product-edit-form.component';
import {AppSoldOutPipe} from '../../../pipes/app-sold-out.pipe';
import {AllergensService} from '../../../services/allergens.service';
import {PrintersService} from '../../../services/printers.service';
import {ProductGroupsService} from '../../../services/product-groups.service';
import {ProductsService} from '../../../services/products.service';
import {SelectedEventService} from '../../../services/selected-event.service';
import {injectOnSubmit} from '../../../util/form';

@Component({
  template: `
    @if (entity(); as entity) {
      <div class="d-flex flex-column gap-2">
        <h1 *isCreating="entity">{{ 'HOME_PROD_ADD' | transloco }}</h1>
        <div class="d-flex gap-3 align-items-center" *isEditingAndNotDeleted="entity">
          <h1>{{ 'EDIT_2' | transloco }} {{ entity.name }}</h1>
          <span class="fs-4 mb-1">{{ entity.soldOut | soldOut }}</span>
        </div>
        <h1 *isEditingAndDeleted="entity">{{ entity.name }} {{ 'DELETED' | transloco }}</h1>

        <scrollable-toolbar>
          <back-button />
          <ng-container *isEditingAndNotDeleted="entity">
            <div>
              <button class="btn btn-sm btn-danger" (mousedown)="onDelete(entity.id)" type="button">
                <bi name="trash" />
                {{ 'DELETE' | transloco }}
              </button>
            </div>

            <div>
              <a class="btn btn-sm btn-secondary" [queryParams]="{productIds: entity.id}" routerLink="../../../orders">
                <bi name="stack" />
                {{ 'NAV_ORDERS' | transloco }}
              </a>
            </div>
            <div>
              <a class="btn btn-sm btn-secondary" [queryParams]="{productIds: entity.id}" routerLink="../../../bills">
                <bi name="cash-coin" />
                {{ 'NAV_BILLS' | transloco }}
              </a>
            </div>
          </ng-container>
          <div class="d-flex align-items-center" *isCreating="entity">
            <app-continues-creation-switch (continuesCreationChange)="continuousCreation.set($event)" />
          </div>
        </scrollable-toolbar>

        <hr />

        @defer (on timer(200)) {
          @if ((productGroups()?.length ?? 1) < 1) {
            <div class="alert alert-warning d-flex gap-2">
              <bi name="exclamation-triangle-fill" />
              <a class="link-warning" routerLink="../../../product-groups/create">{{ 'HOME_PROD_ADD_GROUP_FIRST' | transloco }}</a>
            </div>
          }
          @if ((printers()?.length ?? 1) < 1) {
            <div class="alert alert-warning d-flex gap-2">
              <bi name="exclamation-triangle-fill" />
              <a class="link-warning" routerLink="../../../printers/create">{{ 'HOME_PROD_ADD_PRINTER_FIRST' | transloco }}</a>
            </div>
          }
        }
        <app-product-edit-form
          #form
          [allergens]="allergens()"
          [printers]="printers() ?? []"
          [productGroups]="productGroups() ?? []"
          [selectedEventId]="selectedEventId()"
          [selectedProductGroupId]="selectedProductGroupId()"
          [product]="entity"
          [formDisabled]="formDisabled()"
          (submitUpdate)="onSubmit('UPDATE', $event)"
          (submitCreate)="onSubmit('CREATE', $event)"
        />
      </div>
    } @else {
      <app-edit-placeholder />
    }
  `,
  selector: 'product-edit-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AppEntityEditModule,
    AppProductEditFormComponent,
    AppContinuesCreationSwitchComponent,
    AppDeletedDirectives,
    AppSoldOutPipe,
  ],
})
export class ProductEditPage {
  #productsService = inject(ProductsService);

  form = viewChild<UnknownModelEditFormComponent>('form');

  entity = injectEditEntity({
    get$: (id) => this.#productsService.getSingle$(id),
  });

  onDelete = injectOnDelete((it: number) =>
    this.#productsService.delete$(it).subscribe(() => this.#productsService.triggerGet$.next(true)),
  );
  continuousCreation = injectContinuousCreation({
    formComponent: this.form,
    continuousUsePropertyNames: ['groupId', 'printerId', 'eventId', 'allergenIds'],
  });
  onSubmit = injectOnSubmit({
    entityService: this.#productsService,
    continuousCreation: {
      enabled: this.continuousCreation.enabled,
      patch: this.continuousCreation.patch,
    },
  });

  selectedProductGroupId = injectQueryParams('group', {transform: numberAttribute});

  productGroups = toSignal(inject(ProductGroupsService).getAll$());
  printers = toSignal(inject(PrintersService).getAll$());
  selectedEventId = inject(SelectedEventService).selectedId;
  allergens = toSignal(inject(AllergensService).getAll$(), {initialValue: []});

  formDisabled = computed(() => {
    if ((this.productGroups()?.length ?? 1) < 1) {
      return true;
    }
    if ((this.printers()?.length ?? 1) < 1) {
      return true;
    }
    const entity = this.entity();
    if (entity !== 'CREATE' && !!entity?.deleted) {
      return true;
    }
    return false;
  });
}
